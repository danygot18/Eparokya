import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  INCREMENT_ITEM_QUANTITY,
  DECREMENT_ITEM_QUANTITY,
} from '../constants';

const cartItems = (state = [], action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return [...state, action.payload];
    case REMOVE_FROM_CART:
      return state.filter(cartItem => cartItem !== action.payload);
    case CLEAR_CART:
      return [];
    case INCREMENT_ITEM_QUANTITY:
      return state.map(cartItem =>
        cartItem.id === action.payload.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    case DECREMENT_ITEM_QUANTITY:
      return state.map(cartItem =>
        cartItem.id === action.payload.id && cartItem.quantity > 1
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
    default:
      return state;
  }
};

export default cartItems;
