import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/redux toolkit/cartSlice";
import { HomeIcon } from "@/icons/HomeIcon";
import { RootState } from "@/redux toolkit/store";

const Home = () => {
  const router = useRouter();
  const storeUuid = useSelector((state: RootState) => state.storeInfo.storeUuid);
  const dispatch = useDispatch();
  const handleDelete = () => {
    dispatch(clearCart());
    router.push("/?storeUuid=" + storeUuid);
  };
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <HomeIcon />
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-slate-700 bg-opacity-70 data-[state=open]:animate-overlayShow fixed inset-0 z-[9999] " />
        <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[9999]">
          <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Are you absolutely sure?
          </AlertDialog.Title>
          <AlertDialog.Description className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
          Do you want to reset your selection.
          </AlertDialog.Description>
          <div className="flex justify-end gap-[25px]">
            <AlertDialog.Cancel asChild>
              <button className="text-black border-2 border-black rounded-lg font-bold w-[100px] inline-flex h-[35px] items-center justify-center px-[15px] leading-none cursor-pointer">
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={handleDelete}
                className="text-black border-2 border-black rounded-lg  bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
              >
                Yes
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
export default Home;
