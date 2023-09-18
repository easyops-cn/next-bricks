import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { handleHttpError } from "@next-core/runtime";
import { auth } from "@next-core/easyops-runtime";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { FormItem, FormItemProps } from "@next-bricks/form/form-item";
import { Select, SelectProps } from "@next-bricks/form/select";
import { FormItemElementBase, MessageBody } from "@next-shared/form";
import {
  InstanceApi_postSearch,
  CmdbModels,
  CmdbObjectApi_getObjectRef,
} from "@next-api-sdk/cmdb-sdk";

import {
  zipObject,
  map,
  debounce,
  startsWith,
  filter,
  reject,
  isNil,
  uniqBy,
  uniq,
  find,
  isEmpty,
  isEqual,
  groupBy,
  compact,
  some,
  keyBy,
  DebouncedFunc,
} from "lodash";
import type { Button, ButtonProps } from "@next-bricks/basic/button";

// --- NOTE: uncomment these lines below to enable i18n for your brick ---
// import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
// import { K, NS, locales } from "./i18n.js";
// initializeReactI18n(NS, locales);
type ModelObjectItem = Partial<CmdbModels.ModelCmdbObject>;

const { defineElement, property, event } = createDecorators();
const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");
const WrappedButton = wrapBrick<Button, ButtonProps>("eo-button");

const WrappedSelect = wrapBrick<
  Select,
  SelectProps & {
    onchange: () => void;
    onfocus: () => void;
    onsearch: DebouncedFunc<(e: any) => void>;
  }
>("eo-select");
let objectListCache: ModelObjectItem[];

export type UserOrUserGroupSelectValue = {
  selectedUser: string[];
  selectedUserGroup: string[];
};

export interface EoUserOrUserGroupSelectProps extends FormItemProps {
  value?: UserOrUserGroupSelectValue | undefined;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  validateState?: string;
  onChange?: (value: string[]) => void;
  objectList?: ModelObjectItem[];
  query?: Record<string, any>;
  userGroupQuery?: Record<string, any>;
  userQuery?: Record<string, any>;
  optionsMode: "user" | "group" | "all";
  staticList?: string[];
  isMultiple?: boolean;
  hideAddMeQuickly?: boolean;
}

/**
 * 构件 `eo-user-or-user-group-select`
 */
export
@defineElement("eo-user-or-user-group-select", {
  styleTexts: [styleText],
})
class EoUserOrUserGroupSelect extends FormItemElementBase {
  /**
   * 字段名称
   */
  @property() accessor name: string | undefined;
  /**
   * 字段说明
   */
  @property() accessor label: string | undefined;
  /**
   * 是否必填
   */
  @property({
    type: Boolean,
  })
  accessor required: boolean | undefined;

  /**
   * 字段placeholder
   */
  @property() accessor placeholder: string | undefined;
  /**
   * 值
   */
  @property({
    attribute: false,
  })
  accessor value: string[] | UserOrUserGroupSelectValue | undefined;

  /**
   *  模型列表，不传该属性构件内部会发请求获取该列表，如果需要传该属性则优先使用外部传进来的数据，该数据来自"providers-of-cmdb.cmdb-object-api-get-object-ref" 如 demo 所示
   * advanced
   */
  @property({
    attribute: false,
  })
  accessor objectList: Partial<CmdbModels.ModelCmdbObject>[] | undefined;

  /**
   *  用户和用户组`search`接口的`query`，此参数比较适用于，两者接口需要参数相同的情况
   * advanced
   */
  @property({
    attribute: false,
  })
  accessor query: Record<string, any> | undefined;

  /**
   * @description 针对`USER/instance/_search`接口的`query`，此参数比较适用于，可能只需要针对用户做筛选的情况
   * @group advanced
   */
  @property({
    attribute: false,
  })
  accessor userQuery: Record<string, any> | undefined;

  /**
   * @description 针对`USER_GROUP/instance/_search`接口的`query`，此参数比较适用于，可能只需要针对用户组做筛选的情况
   * @group advanced
   */
  @property({
    attribute: false,
  })
  accessor userGroupQuery: Record<string, any> | undefined;

  /**
   * @default "all"
   * @description 支持选择用户、用户组或者两者
   * @editor radio
   * @editorProps {
   *   "optionType": "button",
   *   "options": [
   *     {
   *       "label": "All",
   *       "value": "all"
   *     },
   *     {
   *       "label": "User",
   *       "value": "user",
   *       "icon": {
   *         "lib": "antd",
   *         "icon": "user",
   *         "theme": "outlined"
   *       }
   *     },
   *     {
   *       "label": "Group",
   *       "value": "group",
   *       "icon": {
   *         "lib": "antd",
   *         "icon": "usergroup-add",
   *         "theme": "outlined"
   *       }
   *     }
   *   ]
   * }
   * @group advanced
   */
  @property({ attribute: false })
  accessor optionsMode: "user" | "group" | "all" = "all";

  /**
   * @default false
   * @description 是否合并用户和用户组数据，当设置为 true 时，输入的`value`和`user.group.change`事件输出的 detail 都为`string[]`格式。
   * @group advanced
   */
  @property({
    type: Boolean,
  })
  accessor mergeUseAndUserGroup: boolean = false;

  /**
   * 是否禁用
   */
  @property({ type: Boolean })
  accessor disabled: boolean | undefined;

  /**
   * @description 是否多选，默认为多选
   * @group advanced
   */
  @property({
    attribute: false,
  })
  accessor isMultiple: boolean = true;

  /**
   * @description 固定白名单列表，该列表中的值用户不能取消。
   * @group advanced
   */
  @property({
    attribute: false,
  })
  accessor staticList: string[] | undefined;

  /**
   * @description 快速选择我
   * @group advanced
   */
  @property({
    attribute: false,
  })
  accessor hideAddMeQuickly: boolean = true;

  @event({ type: "change" })
  accessor #changeEvent!: EventEmitter<string[] | UserOrUserGroupSelectValue>;

  handleUserOrUserGroupChange = (values: string[]) => {
    const resultValue = {
      selectedUser: reject(values, (v) => {
        return startsWith(v, ":");
      }),

      selectedUserGroup: filter(values, (v) => {
        return startsWith(v, ":");
      }),
    };

    this.value = resultValue;
    this.mutableValue = resultValue;
    Promise.resolve().then(() => {
      this.#changeEvent.emit(
        this.mergeUseAndUserGroup ? values : (resultValue as any)
      );
      this.getFormElement()?.resetValidateState();
    });
  };

  private _handleMergeUseAndUserGroup = (
    originValue: string[] | UserOrUserGroupSelectValue
  ): UserOrUserGroupSelectValue => {
    const result = groupBy(originValue, (v) =>
      startsWith(v, ":") ? "selectedUserGroup" : "selectedUser"
    );
    return result as unknown as UserOrUserGroupSelectValue;
  };

  private mutableValue: string[] | UserOrUserGroupSelectValue | undefined;

  connectedCallback(): void {
    this.mutableValue = this.value;
    if (this.mergeUseAndUserGroup && this.value) {
      this.mutableValue = this._handleMergeUseAndUserGroup(this.value);
    }
    super.connectedCallback();
  }

  render() {
    return (
      <EoUserOrUserGroupSelectComponent
        formElement={this.getFormElement()}
        curElement={this}
        name={this.name}
        label={this.label}
        placeholder={this.placeholder}
        required={this.required}
        value={this.mutableValue as UserOrUserGroupSelectValue}
        validateState={this.validateState}
        notRender={this.notRender}
        helpBrick={this.helpBrick}
        trigger="handleUserOrUserGroupChange"
        onChange={this.handleUserOrUserGroupChange}
        objectList={this.objectList}
        query={this.query}
        userQuery={this.userQuery}
        userGroupQuery={this.userGroupQuery}
        optionsMode={this.optionsMode}
        staticList={this.staticList}
        isMultiple={this.isMultiple}
        disabled={this.disabled}
        hideAddMeQuickly={this.hideAddMeQuickly}
      />
    );
  }
}

export function EoUserOrUserGroupSelectComponent(
  props: EoUserOrUserGroupSelectProps
) {
  // const { t } = useTranslation(NS);
  // const hello = t(K.HELLO);
  const [objectList, setObjectList] = useState<ModelObjectItem[]>(
    props.objectList ?? []
  );
  const [searchValue, setSearchValue] = useState<string>();
  const [userList, setUserList] = useState<any[]>([]);
  const [userGroupList, setUserGroupList] = useState<any[]>([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const staticValue = useRef([]);

  const computedValue = useMemo(() => {
    if (isNil(props.value)) {
      return undefined;
    } else {
      return props.isMultiple
        ? [
            ...(props.value?.selectedUser || []),
            ...(props.value?.selectedUserGroup || []),
          ]
        : props.value?.selectedUser?.[0] || props.value?.selectedUserGroup?.[0];
    }
  }, [props.value, props.isMultiple]);

  const getShowKey = useCallback(
    (objectId: string): string[] => {
      const objectMap = keyBy(objectList, "objectId");
      return (
        (objectMap[objectId]?.view && objectMap[objectId].view?.show_key) || [
          "name",
        ]
      );
    },
    [objectList]
  );

  const fetchInstanceList = async (
    objectId: "USER" | "USER_GROUP",
    keyword: string
  ) => {
    const showKey =
      objectId === "USER" ? getShowKey("USER") : getShowKey("USER_GROUP");

    const showKeyQuery = {
      $or: map(uniq([...showKey, "name"]), (v) => ({
        [v]: { $like: `%${keyword}%` },
      })),
      ...(objectId === "USER"
        ? {
            state: "valid",
          }
        : {}),
    };
    const staticQuery =
      objectId === "USER"
        ? {
            name: {
              $in: props.value?.selectedUser,
            },
          }
        : {
            instanceId: {
              // 默认带为":"+instanceId，这里查询的时候去掉前面的冒号
              $in: map(props.value?.selectedUserGroup, (v) =>
                (v as string).slice(1)
              ),
            },
          };

    return (
      await InstanceApi_postSearch(objectId, {
        page: 1,
        page_size: 20,
        fields: {
          ...zipObject(
            showKey,
            map(showKey, (v) => true)
          ),

          name: true,
        },
        query:
          props.userQuery && objectId === "USER"
            ? {
                $and: [props.userQuery, showKeyQuery],
                $or: staticQuery,
              }
            : props.userGroupQuery && objectId === "USER_GROUP"
            ? {
                $and: [props.userGroupQuery, showKeyQuery],
                $or: staticQuery,
              }
            : props.query
            ? {
                $and: [props.query, showKeyQuery],
                $or: staticQuery,
              }
            : { $or: [showKeyQuery, staticQuery] },
      })
    ).list;
  };

  const searchUser = async (value: string) => {
    setUserList((await fetchInstanceList("USER", value)) || []);
  };

  // 用户组在instanceId前面加上:
  const searchUserGroup = async (value: string) => {
    const result = await fetchInstanceList("USER_GROUP", value);
    setUserGroupList(
      result?.map((v) => {
        v.instanceId = ":" + v.instanceId;
        return v;
      }) || []
    );
  };

  const searchUserOrUserGroupInstances = async (value: string) => {
    setSearchValue(value);
    await Promise.all([
      ...(props.optionsMode !== "group" ? [searchUser(value)] : []),
      ...(props.optionsMode !== "user" ? [searchUserGroup(value)] : []),
    ]);
  };

  const handleFocus = () => {
    if (isNil(searchValue) || searchValue !== "") {
      searchUserOrUserGroupInstances("");
    }
  };

  const triggerChange = (changedValue: any) => {
    props.onChange?.(changedValue);
  };

  const handleSelectChange = (e: any) => {
    const originValue = e.detail?.value;

    const value = filter(
      Array.isArray(originValue)
        ? originValue
        : originValue
        ? [originValue]
        : [],
      (item) => {
        return !find(props.staticList, (v) => v === item);
      }
    );

    value.unshift(...staticValue.current);
    setSelectedValue(value as any);
    triggerChange(value);
    if (searchValue !== "") {
      searchUserOrUserGroupInstances("");
    }
  };

  const isDifferent = () => {
    const userOfValues = props.value?.selectedUser || [];
    const userGroupOfValues = props.value?.selectedUserGroup || [];
    const userOfSelectedValue = map(
      filter(selectedValue, (item: any) => !item?.key?.startsWith(":")),
      "key"
    );

    const userGroupOfSelectedValue = map(
      filter(selectedValue, (item: any) => item?.key?.startsWith(":")),
      "key"
    );

    return (
      !isEqual([...userOfValues].sort(), [...userOfSelectedValue].sort()) ||
      !isEqual(
        [...userGroupOfValues].sort(),
        [...userGroupOfSelectedValue].sort()
      )
    );
  };

  useEffect(() => {
    (async () => {
      if (!props.objectList) {
        if (objectListCache) {
          setObjectList(objectListCache);
        } else {
          try {
            const list = (
              await CmdbObjectApi_getObjectRef({
                ref_object: "USER,USER_GROUP",
              })
            ).data;
            setObjectList(list);
            objectListCache = list;
          } catch (e) {
            // istanbul ignore next
            handleHttpError(e);
          }
        }
      } else {
        setObjectList(props.objectList);
      }
    })();
  }, [props.objectList, props.notRender]);

  const initializeStaticList = () => {
    return groupBy(props.staticList, (v) =>
      startsWith(v, ":") ? "userGroup" : "user"
    );
  };
  const getLabel = (
    objectId: "USER" | "USER_GROUP",
    instanceData: any
  ): string => {
    const showKey =
      objectId === "USER" ? getShowKey("USER") : getShowKey("USER_GROUP");
    let showName;
    if (Array.isArray(showKey)) {
      showName = showKey
        .map((key, index) => {
          if (index === 0) {
            return instanceData[key];
          } else {
            return instanceData[key] ? "(" + instanceData[key] + ")" : "";
          }
        })
        .join("");
    } else {
      showName = instanceData[showKey];
    }
    return showName || instanceData.name;
  };

  useEffect(() => {
    const initializeSelectedValue = async () => {
      if (props.value) {
        let selectedUser: any[] = [];
        let selectedUserGroup: any[] = [];
        const staticKeys = initializeStaticList();
        const user = compact(
          uniq(
            []
              .concat(staticKeys.user as any)
              .concat(props.value?.selectedUser as any)
          )
        );

        const userGroup = compact(
          uniq(
            []
              .concat(staticKeys.userGroup as any)
              .concat(props.value.selectedUserGroup as any)
          )
        );

        if (
          (staticKeys.user &&
            some(
              staticKeys.user,
              (v) => !props.value?.selectedUser?.includes(v)
            )) ||
          (staticKeys.userGroup &&
            some(
              staticKeys.userGroup,
              (v) => !props.value?.selectedUserGroup?.includes(v)
            ))
        ) {
          triggerChange({
            selectedUser: user,
            selectedUserGroup: userGroup,
          });
        }
        const staticValueToSet: any = [];
        if (user.length && props.optionsMode !== "group") {
          selectedUser = (
            await InstanceApi_postSearch("USER", {
              query: {
                name: {
                  $in: user,
                },
              },

              page: 1,
              page_size: user.length,
              fields: {
                ...zipObject(
                  getShowKey("USER"),
                  map(getShowKey("USER"), (v) => true)
                ),

                name: true,
              },
            })
          ).list as any[];
        }
        if (userGroup.length && props.optionsMode !== "user") {
          selectedUserGroup = (
            await InstanceApi_postSearch("USER_GROUP", {
              query: {
                instanceId: {
                  // 默认带为":"+instanceId，这里查询的时候去掉前面的冒号
                  $in: map(userGroup, (v) => (v as string).slice(1)),
                },
              },

              page: 1,
              page_size: userGroup.length,
              fields: {
                ...zipObject(
                  getShowKey("USER_GROUP"),
                  map(getShowKey("USER_GROUP"), (v) => true)
                ),

                name: true,
              },
            })
          ).list as any[];
        }
        let labelValue = [
          ...map(selectedUser, (v) => {
            const labelText = getLabel("USER", v);
            const result = {
              key: v.name,
              label: labelText,
            };

            if (props.staticList?.includes(v.name)) {
              staticValueToSet.push(result);
            }
            return result;
          }),
          ...map(selectedUserGroup, (v) => {
            const labelText = getLabel("USER_GROUP", v);
            const result = {
              key: ":" + v.instanceId,
              label: labelText,
            };

            if (props.staticList?.includes(":" + v.instanceId)) {
              staticValueToSet.push(result);
            }
            return result;
          }),
        ];

        labelValue = [
          ...staticValueToSet,
          ...filter(labelValue, (v) => !props.staticList?.includes(v.key)),
        ];
        setSelectedValue(labelValue as any);
        setUserList(selectedUser);
        setUserGroupList(selectedUserGroup);
        staticValue.current = staticValueToSet;
      }
    };
    if (isDifferent()) {
      initializeSelectedValue();
    }
  }, []);

  const selectOptions = useMemo(() => {
    let userListOptions: any = [];
    let userGroupListOptions: any = [];
    if (userList.length) {
      userListOptions = [
        {
          label: "用户(仅显示前20项，更多结果请搜索)",
          options: userList.map((user) => ({
            label: getLabel("USER", user),
            value: user.name,
            closeable: !props?.staticList?.includes(user.name),
          })),
        },
      ];
    }
    if (userGroupList.length) {
      userGroupListOptions = [
        {
          label: "用户组(仅显示前20项，更多结果请搜索",
          options: userGroupList.map((group) => ({
            label: getLabel("USER_GROUP", group),
            value: group.instanceId,
            closeable: !props?.staticList?.includes(group.instanceId),
          })),
        },
      ];
    }

    return props.optionsMode === "user"
      ? userListOptions
      : props.optionsMode === "group"
      ? userGroupListOptions
      : [...userListOptions, ...userGroupListOptions];
  }, [userList, userGroupList, props.optionsMode, props.staticList]);

  // 快速选择我
  const addMeQuickly = async () => {
    const myUserName = auth.getAuth().username;
    if (find(selectedValue, (v) => v === myUserName)) {
      // 如果已选择项中包含我，则不重新发起请求
      return;
    }
    const myUser = (
      await InstanceApi_postSearch("USER", {
        query: {
          name: {
            $eq: myUserName,
          },
        },

        page: 1,
        page_size: 1,
        fields: {
          ...zipObject(
            getShowKey("USER"),
            map(getShowKey("USER"), (v) => true)
          ),

          name: true,
        },
      })
    ).list as any[];
    myUser.length && setUserList([...userList, ...myUser]);
    handleSelectChange({ detail: { value: [...selectedValue, myUserName] } });
  };

  return (
    <WrappedFormItem {...(props as FormItemProps)}>
      <div className="select-wrapper">
        <WrappedSelect
          clearable={true}
          multiple={props.isMultiple}
          placeholder={props.placeholder}
          value={computedValue}
          onchange={handleSelectChange as any}
          onfocus={handleFocus}
          onsearch={debounce((e) => {
            searchUserOrUserGroupInstances(e.detail.value as string);
          }, 500)}
          options={selectOptions as any}
          disabled={props.disabled}
        ></WrappedSelect>
        {!props.hideAddMeQuickly && props.optionsMode !== "group" && (
          <WrappedButton
            onClick={addMeQuickly}
            type="link"
            size="large"
            style={{ fontSize: "16px" }}
            icon={{
              lib: "easyops",
              icon: "quick-add-me",
            }}
          ></WrappedButton>
        )}
      </div>
    </WrappedFormItem>
  );
}
