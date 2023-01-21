import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import {
  selectItemQuantityByItemId,
  addOne,
  updateOne,
  updateRemoteSnapshot,
} from "../../app/store-slices/cart-slice";
import { selectCurrentUser } from "../../app/store-slices/auth-slice";
import { setAuthModalState } from "../../app/store-slices/app-slice";
import { setToastState } from "../../app/store-slices/app-slice";
import { fetchItem } from "../../app/services/item-api";
import {
  Item,
  parseAttributeGroupsIntoMap,
  parseItemIntoSnapshot,
} from "../../models/item";
import { CartItemAttributeSnapshot } from "../../models/cart-snapshot";
import Context, {
  ItemPageState,
  validateGroupConditions,
} from "./item-page-context";
import { countAttributes, computeTotal } from "../../utils/item-helpers";
import "./item-page.css";

import ItemPageSkeleton from "./item-page-skeleton";
import ItemPagePrice from "./item-page-price";
import ItemPickerAddButton from "./item-page-picker-add-button";
import ItemPickerUpdateButton from "./item-page-picker-update-button";
import ItemPageGuarantee from "./item-page-guarantee";
import ItemPageInfo from "./item-page-info";
import AttributeGroup from "./attributes/attribute-group";

const ItemPage: React.FC = () => {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null | undefined>(undefined);
  const [contextState, setContextState] = useState<ItemPageState | undefined>();
  const [count, setCount] = useState<number>(1);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectCurrentUser);
  const quantityInCart = useSelector((state: RootState) =>
    selectItemQuantityByItemId(state, id || "")
  );

  // Fetches the item
  //// Sets the item
  //// Sets the page context
  useEffect(() => {
    if (!id) {
      setItem(null);
      return;
    }

    const fetch = async () => {
      const item = await fetchItem(id);

      if (item) {
        setItem(item);
        setContextState({
          attributeSnapshots: parseAttributeGroupsIntoMap(
            item.attribute_groups
          ),
          updateContext: (state) => {
            setContextState({ ...state });
          },
        });
      } else {
        setItem(null);
      }
    };

    fetch();
  }, [id]);

  // Update the starting count
  //// Sets the starting count to the quantity in cart if item is quickadd
  //// Sets the starting count to 1 in any other case
  useEffect(() => {
    if (quantityInCart > 0 && item && item.quick_add) {
      setCount(quantityInCart);
    } else {
      setCount(1);
    }
  }, [quantityInCart, item]);

  // Handle add to cart method of the picker button
  //// Dispatches an addOne action to update the cart
  //// Dispatches an updateRemoteSnapshot action to update the remote cart
  const onAdd = () => {
    if (!user) {
      dispatch(setAuthModalState({ isOpen: true }));
      return;
    }

    if (!item) {
      return;
    }

    if (!item.available || !contextState) {
      return;
    }

    if (!item.quick_add) {
      // Validate if groups conditions have been met
      const groupConditions = validateGroupConditions(
        contextState.attributeSnapshots,
        item.attribute_groups
      );

      if (!groupConditions.valid) {
        const groupEl = document.getElementById(
          `attributegroup-${groupConditions.groupID}`
        );

        groupEl?.scrollIntoView({ behavior: "smooth", block: "start" });
        dispatch(
          setToastState({
            isOpen: true,
            message: `Soddisfa le condizioni di "${groupConditions.groupName}" per procedere`,
          })
        );
        return;
      }
    }

    /// Create a cart item snapshot
    const selectedAttributes: CartItemAttributeSnapshot[] = [];
    contextState.attributeSnapshots.forEach((group) => {
      group.forEach((snapshot) => {
        if (snapshot.quantity > 0) {
          selectedAttributes.push(snapshot);
        }
      });
    });

    const itemSnapshot = parseItemIntoSnapshot(item);
    itemSnapshot.attributes_snapshot = selectedAttributes;

    dispatch(addOne({ item: itemSnapshot, quantity: count }));
    dispatch(updateRemoteSnapshot());
  };

  // Handle add to cart method of the quickadd picker button
  //// Dispatches an updateOne action to update the cart
  //// Dispatches an updateRemoteSnapshot action to update the remote cart
  const onUpdate = () => {
    if (!user) {
      dispatch(setAuthModalState({ isOpen: true }));
      return;
    }

    if (!item) {
      return;
    }

    if (!item.available || !contextState) {
      return;
    }

    /// Create a cart item snapshot
    const selectedAttributes: CartItemAttributeSnapshot[] = [];
    contextState.attributeSnapshots.forEach((group) => {
      group.forEach((snapshot) => {
        if (snapshot.quantity > 0) {
          selectedAttributes.push(snapshot);
        }
      });
    });

    const itemSnapshot = parseItemIntoSnapshot(item);
    itemSnapshot.quantity = count;
    itemSnapshot.attributes_snapshot = selectedAttributes;

    console.log(itemSnapshot);

    dispatch(updateOne({ item: itemSnapshot }));
    dispatch(updateRemoteSnapshot());
  };

  if (item === undefined || contextState === undefined) {
    return <ItemPageSkeleton />;
  }

  if (item === null) {
    return <div>Can't find item</div>;
  }

  return (
    <Context.Provider value={contextState}>
      <div className="itempage-content">
        {/* Media */}
        <div className="itempage-itemimage-content">
          <img className="itempage-itemimage" src={item.media_url} />
        </div>

        <div className="itempage-itemname-content">
          <span className="itempage-itemname">{item.name}</span>
        </div>
        <div className="itempage-itemdescription-content">
          <span className="itempage-itemdescription">{item.description}</span>
        </div>

        {/* Item price */}
        <ItemPagePrice
          item={item}
          total={
            item.quick_add
              ? item.discount
                ? item.discount_price
                : item.price
              : computeTotal(
                  item.discount ? item.discount_price : item.price,
                  count,
                  contextState.attributeSnapshots
                )
          }
          showExtView={
            countAttributes(contextState.attributeSnapshots) > 0 || count > 1
          }
        />

        {/* Change item quantity and add to cart */}
        <div className="itempage-buttons-content">
          {item.quick_add && quantityInCart > 0 ? (
            <ItemPickerUpdateButton
              count={count}
              quantity={quantityInCart}
              onIncrease={() => setCount((count) => count + 1)}
              onDecrease={() => setCount((count) => count - 1)}
              onUpdate={onUpdate}
            />
          ) : (
            <ItemPickerAddButton
              count={count}
              onIncrease={() => setCount((count) => count + 1)}
              onDecrease={() => setCount((count) => count - 1)}
              onAdd={onAdd}
            />
          )}
        </div>

        {/* Guarantee disclaimer */}
        <ItemPageGuarantee />

        <hr className="itempage-break-small" />

        {/* Item infos */}
        {item.details.length || item.ingredients.length ? (
          <React.Fragment>
            <ItemPageInfo
              details={item.details}
              ingredients={item.ingredients}
            />
            <hr className="itempage-break-small" />
          </React.Fragment>
        ) : null}

        {/* Addition groups */}
        {item.attribute_groups.map((group) => (
          <AttributeGroup group={group} key={group._id} />
        ))}
      </div>
    </Context.Provider>
  );
};

export default ItemPage;
