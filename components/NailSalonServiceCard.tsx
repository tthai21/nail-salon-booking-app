"use client";
import React from "react";
import { AddIcon } from "@/icons/AddIcon";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/redux toolkit/cartSlice";
import { CheckIcon } from "@/icons/CheckIcon";
import "@radix-ui/themes/styles.css";
import { Spinner } from "@radix-ui/themes";



const NailSalonServiceCard = ({ service }: { service: NailSalonService }) => {
  const {
    id,
    serviceType,
    serviceName,
    estimatedTime,
    servicePrice,
    serviceDescription,
  } = service;

  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);

  const isServiceInCart: boolean | null = cartItems?.some(
    (item: any) => item.id === id
  );

  const handleClickAdd = () => {
    dispatch(
      addToCart({
        id: id,
        serviceType: serviceType,
        serviceName: serviceName,
        serviceDescription: serviceDescription,
        estimatedTime: estimatedTime,
        servicePrice: servicePrice,
        quantity: 1,
      })
    );
  };

  const handleClickRemove = () => {
    dispatch(
      removeFromCart({
        id: id,
        estimatedTime: estimatedTime,
        servicePrice: servicePrice,
      })
    );
  };

  return (
    <div className="bg-transparent lg:rounded-lg shadow-md p-4  mx-auto flex items-center justify-between my-2  w-full ">
      {!service ? (
        <Spinner />
      ) : (
        <>
          <div className="w-full">
            <h2 className="text-lg font-semibold">{serviceName}</h2>
            <p className="text-gray-600 ">{serviceDescription}</p>
            <div className="flex items-center justify-start gap-3">
              <p className="text-gray-600 ">
                Estimated time: {estimatedTime} min
              </p>
              <p>-</p>
              <p className="text-primary-500 font-bold text-xl">
                ${servicePrice}
              </p>
            </div>
          </div>
          <div className="mr-7">
            {!isServiceInCart ? (
              <AddIcon onClick={handleClickAdd} />
            ) : (
              <CheckIcon onClick={handleClickRemove} />
         
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NailSalonServiceCard;
