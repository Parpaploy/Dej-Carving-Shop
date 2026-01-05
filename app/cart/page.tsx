import React from 'react';
import CartClient from '../components/clients/cart'; 

export const metadata = {
  title: 'My Shopping Cart | Dej Carving',
  description: 'Review your antique items before checkout.',
};

export default function CartPage() {
  return <CartClient />;
}