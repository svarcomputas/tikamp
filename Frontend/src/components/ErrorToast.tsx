import { Toast } from "flowbite-react";
import { HiExclamationCircle } from 'react-icons/hi'; // Icon for error


const ErrorToast = () => (
    <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-4">
    <Toast>
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
        <HiExclamationCircle className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-normal">Greide ikke tolke input</div>
      <Toast.Toggle />
    </Toast>
    </div>
  );

export default ErrorToast;