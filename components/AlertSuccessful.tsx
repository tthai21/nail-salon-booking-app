import React, { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";
import { clearCart } from "@/redux toolkit/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckIcon from "@mui/icons-material/Check";
import { pink } from "@mui/material/colors";
import CustomLoading from "./Loading";
import { Snackbar, Alert } from "@mui/material";
import PendingIcon from "@mui/icons-material/Pending";
import { RootState } from "@/redux toolkit/store";

const AlertSuccessful: React.FC<{
  id: string | number;
  ok: boolean | null;
  bookingInfo: CartState;
  formValid: boolean;
  status: string;
  isLoading: boolean;
  onClick?: () => void;
}> = ({ formValid, onClick, bookingInfo, ok, id, status, isLoading }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const storeUuid = useSelector((state: RootState) => state.storeInfo.storeUuid);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(id.toString());
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          onClick={onClick}
          type="submit"
          disabled={!formValid}
          className={`${
            formValid
              ? "bg-primary-700 cursor-pointer  border-primary-700 hover:text-pink-900 hover:border-pink-900 "
              : "bg-gray-700 opacity-50 "
          }  text-white border rounded-lg font-bold w-[200px] h-[45px] shadow-green7 inline-flex items-center justify-center px-[30px] leading-none focus:shadow-[0_0_0_2px] text-xl   mt-20`}
        >
          {isLoading ? <CustomLoading /> : "Confirm"}
        </button>
      </AlertDialog.Trigger>
      {ok == true && (
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-slate-700 bg-opacity-70 data-[state=open]:animate-overlayShow fixed inset-0" />
          <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[80vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[10px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <>
              <AlertDialog.Title className="text-mauve12 m-0 text-md font-bold  flex justify-center items-center">
                Confirmation
              </AlertDialog.Title>
              <AlertDialog.Description className="flex justify-center  xs:text-xl  mb-3 mt-3 font-bold">
                Your reservation is confirmed
              </AlertDialog.Description>
              <AlertDialog.Description className="text-lg font-semibold mt-5">
                {`We'll see you at`}
              </AlertDialog.Description>
              <AlertDialog.Description className="flex justify-between text-md font-semibold mb-3 text-gray-500">
                {`${moment(bookingInfo.selectedDate, "DD/MM/YY").format(
                  "D MMM"
                )} , ${moment(bookingInfo.selectedHour, "HH:mm").format(
                  "h.mm a"
                )}`}
                <CalendarMonthIcon sx={{ color: pink[500] }} />
              </AlertDialog.Description>
              <AlertDialog.Description className="text-lg  mt-5 font-bold">
                Booking ID:
              </AlertDialog.Description>
              <AlertDialog.Description className="flex justify-between text-md font-semibold mb-3 text-gray-500">
                {id}{" "}
                <ContentCopyIcon
                  sx={{ color: pink[500], cursor: "pointer" }}
                  onClick={handleCopyClick}
                />
                <Snackbar
                  open={open}
                  autoHideDuration={2000}
                  onClose={() => setOpen(false)}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                  <Alert onClose={() => setOpen(false)} severity="success">
                    Copied to clipboard!
                  </Alert>
                </Snackbar>
              </AlertDialog.Description>

              <AlertDialog.Description className="text-lg  mt-5 font-bold">
                Status:
              </AlertDialog.Description>
              <AlertDialog.Description className="flex justify-between text-md font-semibold mb-3 text-gray-500">
                {status}
                {status == "APPROVED" && (
                  <CheckIcon sx={{ color: pink[500] }} />
                )}
                {status == "PENDING" && (
                  <PendingIcon sx={{ color: pink[500] }} />
                )}
              </AlertDialog.Description>
            </>

            <div className="flex justify-end gap-[25px]">
              <AlertDialog.Action asChild>
                <div
                  onClick={() => {
                    dispatch(clearCart());
                    
                    router.push("/?storeUuid=" + storeUuid);
                  }}
                  className="bg-primary-700 text-white border-2 mt-6 border-primary-700 rounded-lg font-bold w-full lg:mx-20 h-[35px] shadow-green7  items-center justify-center leading-none focus:shadow-[0_0_0_2px] flex cursor-pointer"
                >
                  Done
                </div>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      )}
    </AlertDialog.Root>
  );
};

export default AlertSuccessful;
