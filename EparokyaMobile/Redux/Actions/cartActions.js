import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  INCREMENT_ITEM_QUANTITY,
  DECREMENT_ITEM_QUANTITY,
} from '../constants';

export const addToCart = (payload) => {
  return {
      type: ADD_TO_CART,
      payload
  }
}

export const removeFromCart = (payload) => {
  return {
      type: REMOVE_FROM_CART,
      payload
  }
}

export const clearCart = () => {
  return {
      type: CLEAR_CART
  }
}
export const incrementItemQuantity = (payload) => {
  return {
    type: INCREMENT_ITEM_QUANTITY,
    payload,
  };
};

export const decrementItemQuantity = (payload) => {
  return {
    type: DECREMENT_ITEM_QUANTITY,
    payload,
  };
};