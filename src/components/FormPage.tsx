"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "@/utils/axios";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  useToast,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { FiUploadCloud } from "react-icons/fi"; 
import { AiOutlineFileZip } from "react-icons/ai"; 

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast(); 

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/x-zip-compressed") {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid File.",
        description: "Please select a valid ZIP file.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "No File Selected.",
        description: "Please select a file before uploading.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      await axios.post("/api/files/upload-once", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          accept: "*/*",
        },
      });
      setIsLoading(false);

      toast({
        title: "Success!",
        description: "File uploaded successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      
      setFile(null);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Upload Failed.",
        description: "There was an issue with the file upload. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.100"
    >
      <VStack
        as="form"
        onSubmit={handleSubmit}
        spacing={4}
        p={8}
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        width="sm"
      >
        <Text fontSize="xl" fontWeight="bold" color="gray.700">
          Upload ZIP File
        </Text>

        {/* Кастомизированное поле для загрузки */}
        <Box
          position="relative"
          border="2px dashed #ccc"
          borderRadius="md"
          p={4}
          w="100%"
          h="150px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg={file ? "gray.50" : "gray.100"}
          _hover={{ borderColor: "teal.400", cursor: "pointer" }}
        >
          <Input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            opacity="0"
            zIndex="1"
          />
          {!file ? (
            <Flex direction="column" alignItems="center">
              <Icon as={FiUploadCloud} boxSize={8} color="gray.400" />
              <Text color="gray.500" mt={2}>
                Drag & drop or click to select ZIP file
              </Text>
            </Flex>
          ) : (
            <Flex direction="column" alignItems="center">
              <Icon as={AiOutlineFileZip} boxSize={8} color="teal.400" />
              <Text color="teal.600" mt={2}>
                {file.name}
              </Text>
            </Flex>
          )}
        </Box>

        <Button
          type="submit"
          colorScheme="teal"
          isLoading={isLoading}
          loadingText="Uploading"
          disabled={isLoading}
          width="full"
        >
          Upload
        </Button>
      </VStack>
    </Box>
  );
};

export default FileUpload;
