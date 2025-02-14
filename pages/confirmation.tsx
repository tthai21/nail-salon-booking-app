import React, { useCallback, useEffect, useState } from "react";
import Cart from "@/components/Cart";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import AlertSuccessful from "@/components/AlertSuccessful";
import axios from "@/ulti/axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { CircularProgress, TextField } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import useMediaQuery from '@mui/material/useMediaQuery';

interface BookingSubmitForm {
  firstName: string;
  lastName: string;
  phone: string;
  note: string;
}

const ConfirmationPage: React.FC = () => {
  const [ok, setOk] = useState<boolean>(false);
  const bookingInfo = useSelector((state: any) => state.cart);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const urlStoreUuid = router.query;
  const [captchaToken, setCaptchaToken] = useState('');
  const { control, register, formState: { errors }, handleSubmit } = useForm<BookingSubmitForm>()
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    if (bookingInfo?.guests.length === 0 && urlStoreUuid.storeUuid) {
      router.push("/?storeUuid=" + urlStoreUuid.storeUuid);
    }
  }, [bookingInfo, router]);

  // Create an event handler so you can call the verification on button click event or form submit
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }

    const captchaTokenResponse = await executeRecaptcha('booking');
    setCaptchaToken(captchaTokenResponse);
  }, [executeRecaptcha]);

  const [res, setRes] = useState<any>(null);

  const onSubmit = async (formData: BookingSubmitForm) => {
    setIsLoading(true);
    handleReCaptchaVerify();

    const serviceItems = bookingInfo?.items?.map(
      (service: ServiceItem) => ({
        id: service.id,
      })
    );

    const payload = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      },
      note: formData.note,
      bookingTime: `${bookingInfo.selectedDate} ${bookingInfo.selectedHour}`,
      guests: bookingInfo.guests
    };

    try {
      const response = await axios.post(
        "/reservation/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            'X-StoreID': urlStoreUuid.storeUuid,
            "Captcha-Token": captchaToken,
          },
        }
      );
      setOk(response.status === 201);
      setIsLoading(false)
      setRes(response.data);

      if (response.status !== 201) {
        throw new Error("Failed to submit booking.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setIsLoading(false)

    }
  };

  useEffect(() => {
    handleReCaptchaVerify();
  }, [handleReCaptchaVerify]);


  const FormFieldSkeleton = () => (
    <div className="w-full h-10 bg-gray-200 rounded-md"></div>
  );

  const ConfirmationMessageSkeleton = () => (
    <div className="w-full h-10 bg-gray-200 rounded-md"></div>
  );

  if (!bookingInfo) {
    return (
      <div className="w-[90%] sm:w-[65%] mx-auto mt-9">
        <div>
          <h1 className="text-2xl font-semibold mb-5">Booking confirmation</h1>
          <div className="w-full h-40 bg-gray-200 rounded-md"></div>
          <div className="w-full h-10 bg-gray-200 rounded-md mb-3 mt-3"></div>
          <div className="w-full h-10 bg-gray-200 rounded-md mb-3"></div>
          <div className="max-w-[500px] mx-auto mt-10">
            <form className="flex flex-col justify-center">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <FormFieldSkeleton key={index} />
              ))}
              <ConfirmationMessageSkeleton />
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90%] sm:w-[65%] mx-auto mt-9">
      <div>
        <h1 className="text-2xl font-semibold mb-5">Booking confirmation</h1>
        {isMobile && <Cart />}
        <div className="max-w-[500px] mx-auto mt-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center  "
          >
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "First name is required", maxLength: { value: 20, message: "First name cannot exceed 20 characters" } }}
              render={({ field }) => (
                <div className="mb-4">
                  <TextField
                    {...field}
                    required
                    id="firstName"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName ? errors.firstName.message : ''}
                    inputProps={{ maxLength: 20 }}
                  />
                </div>
              )}
            />
            <Controller
              name="lastName"
              control={control}
              rules={{ required: "Last name is required", maxLength: { value: 20, message: "Last name cannot exceed 20 characters" } }}
              render={({ field }) => (
                <div className="mb-4">
                  <TextField
                    {...field}
                    id="lastName"
                    required
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName ? errors.lastName.message : ''}
                    inputProps={{ maxLength: 20 }}
                  />
                </div>
              )}
            />
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "Phone number is required",
                maxLength: { value: 10, message: "Phone number cannot exceed 10 digits" },
                minLength: { value: 10, message: "Phone number must be at least 10 digits" },
                pattern: { value: /^04[0-9]*$/, message: "Phone number must start with 04" }
              }}
              render={({ field }) => (
                <div className="mb-4">
                  <TextField
                    {...field}
                    id="phone"
                    type="tel"
                    required
                    label="Mobile Number"
                    inputMode="numeric"
                    placeholder="04xxxxxxxx"
                    variant="outlined"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone ? errors.phone.message : ''}
                    inputProps={{ maxLength: 10 }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.value = target.value.replace(/\D/g, '');
                      field.onChange(target.value);
                    }}
                  />
                </div>
              )}
            />
            <Controller
              name="note"
              control={control}
              rules={{
                maxLength: { value: 100, message: "Note cannot exceed 100 characters" }
              }}
              render={({ field }) => (
                <div className="mb-4">
                  <TextField
                    {...field}
                    id="note"
                    placeholder="Note for shop"
                    label="Note"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.note}
                    helperText={errors.note ? errors.note.message : ''}
                    inputProps={{ maxLength: 100 }}
                  />
                </div>
              )}
            />
            <LoadingButton
              type="submit"
              variant="contained" // Use 'contained' to have a solid background color
              className="mt-4 px-4 py-2 w-full md:w-auto"
              loading={isLoading}
              loadingIndicator={<CircularProgress style={{ color: 'white' }} size={24} />}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                borderRadius: '20px',
                textTransform: 'none', // Keep the text casing as it is
                '&:hover': {
                  backgroundColor: 'black', // Keep the same background color on hover
                },
              }}
            >
              Create booking
            </LoadingButton>
            <div className="flex justify-center items-center mx-10 mt-10">
              <AlertSuccessful
                bookingInfo={bookingInfo}
                ok={ok}
                id={res?.id}
                status={res?.status}
                isLoading={isLoading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ConfirmationPage;
