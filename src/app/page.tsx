import FileUpload from "@/components/FormPage";
import { ChakraProvider } from "@chakra-ui/react";

export default function App() {
  return (
    <>
      <ChakraProvider>
        <FileUpload />
      </ChakraProvider>
    </>
  );
}
