import React, { useState } from "react";
import {
  Text,
  FormControl,
  Stack,
  Button,
  FormLabel,
  Input,
  useToast,
  Container,
} from "@chakra-ui/react";
import studentDetails from "../../models/student.type";
import { SessionWallet } from "algorand-session-wallet";
import { NFT } from "../../algorand/nft";
import axios, { AxiosError } from "axios";
// import instance from "../../api/api";
// import { META_URL } from "../../api/api";
import { useForm } from "react-hook-form";
import { fundAccount } from "../../algorand/algorand";
import algosdk from "algosdk";

export type MinterProps = {
  activeConfig: number;
  sw: SessionWallet;
};
type loaderState = {
  loading: boolean;
};

const initLoader: loaderState = {
  loading: false,
};

const Create = (props: MinterProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<studentDetails>({
    defaultValues: {
      student_id: "",
      student_name: "",
      course: "",
      grade: "",
    },
  });

  const [loading, setLoading] = useState(initLoader.loading);
  const [createdId, setCreatedId] = useState<any>(0);
  const [nft, setNFT] = useState<any>();
  const toast = useToast();

  async function createNft(studentname: string, student_id: string) {
    const META_URL = "https://bothouniversity.com/";
    const cid = META_URL + student_id;
    toast({
      title: "Comfirm",
      position: "top",
      description: "Please Confirm The Transaction On Your Wallet",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
    console.log("NFT CREATING");
    const result = await NFT.create(
      props.sw.wallet,
      props.activeConfig,
      cid,
      studentname
    );

    setNFT(result);
    setCreatedId(result);
    return result;
  }

  const onSubmit = async (data: studentDetails) => {
    //const addresses = props.sw.getDefaultAccount();
    //setLoading(true);
    //const { student_id, student_name, course, grade } = data;
    createNft(data.student_name, data.student_id);
    // toast({
    //   title: "Student Created",
    //   position: "top",
    //   description: "Graduate created Successfully",
    //   status: "success",
    //   duration: 5000,
    //   isClosable: true,
    // });
    //setLoading(false);
    //reset();

    //   const properties = {
    //     student_id,
    //     student_name,
    //     course,
    //     grade,
    //   };
    //   await instance
    //     .post("/addgraduatesDataRoute/addGraduateData", {
    //       properties,
    //     })
    //     .then((res: { data: studentDetails }) => {
    //       const id = localStorage.getItem("token_id");
    //       if (res && id) {
    //         console.log(id);
    //         console.log(addresses);
    //         instance
    //           .put(`/updateStudentMetadata/studentData/${student_id}`, {
    //             app_id: id,
    //             issuer_address: addresses,
    //           })
    //           .then((res: { data: any }) => {
    //             toast({
    //               title: "Student Created",
    //               position: "top",
    //               description: "Graduate created Successfully",
    //               status: "success",
    //               duration: 5000,
    //               isClosable: true,
    //             });
    //             fundAccount(
    //               props.sw.wallet,
    //               props.activeConfig,
    //               algosdk.generateAccount(),
    //               parseInt(id)
    //             );
    //             console.log(res.data);
    //             setLoading(false);
    //             reset();
    //           })
    //           .catch((err: Error | AxiosError) => {
    //             setLoading(false);
    //             reset();
    //             if (axios.isAxiosError(err) && err.response) {
    //               const errMessage = err.response.data;
    //               toast({
    //                 title: "Failed",
    //                 description: `${errMessage}`,
    //                 status: "error",
    //                 duration: 9000,
    //                 isClosable: true,
    //               });
    //               console.log(err);
    //               if (err.response) {
    //                 console.log(err.response.status);
    //                 console.log(err);
    //               }
    //             }
    //           });
    //       }
    //     })
    //     .catch((err: Error | AxiosError) => {
    //       setLoading(false);
    //       if (axios.isAxiosError(err) && err.response) {
    //         const errMessage = err.response.data;
    //         toast({
    //           title: "Failed",
    //           description: `${errMessage}`,
    //           status: "error",
    //           duration: 9000,
    //           isClosable: true,
    //         });
    //         console.log(err);
    //         if (err.response) {
    //           console.log(err.response.status);
    //           console.log(err);
    //         }
    //       }
    //     });
    //}
  };

  return (
    <>
      <Container maxW="6xl">
        <Stack
          px={{ base: "1rem", md: "15rem" }}
          mt="8rem"
          alignContent="center"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <Text
                fontStyle="normal"
                fontWeight="700"
                fontSize="30px"
                lineHeight="36px"
              >
                Student Details
              </Text>

              <FormControl>
                <FormLabel>Student Id</FormLabel>
                <Input
                  type="text"
                  maxW="full"
                  h="3rem"
                  {...register("student_id", {
                    required: true,
                    maxLength: 50,
                  })}
                />
                {errors.student_id && errors.student_id.type === "required" && (
                  <Text as={"span"} color="red" fontSize="15px">
                    student ID is required
                  </Text>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Student name</FormLabel>
                <Input
                  type="text"
                  w="full"
                  h="3rem"
                  {...register("student_name", {
                    required: true,
                    maxLength: 50,
                  })}
                />
                {errors.student_name &&
                  errors.student_name.type === "required" && (
                    <Text as={"span"} color="red" fontSize="15px">
                      student name is required
                    </Text>
                  )}
              </FormControl>
              <FormControl>
                <FormLabel>Course</FormLabel>
                <Input
                  type="text"
                  w="full"
                  h="3rem"
                  {...register("course", {
                    required: true,
                    maxLength: 50,
                  })}
                />
                {errors.course && errors.course.type === "required" && (
                  <Text as={"span"} color="red" fontSize="15px">
                    student course is required
                  </Text>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Grade</FormLabel>
                <Input
                  type="text"
                  w="full"
                  h="3rem"
                  {...register("grade", {
                    required: true,
                    maxLength: 50,
                  })}
                />
                {errors.grade && errors.grade.type === "required" && (
                  <Text as={"span"} color="red" fontSize="15px">
                    student grade is required
                  </Text>
                )}
              </FormControl>
            </Stack>
            <Button
              mt="2rem"
              h="3.5rem"
              w="full"
              color="#ffffff"
              bg="#2C66B8"
              _hover={{ bg: "#2C66B8" }}
              type="submit"
              isLoading={loading}
              loadingText="creating student credentials"
              _loading={{ bg: "#2C66B8", color: "#ffffff" }}
            >
              Submit
            </Button>
          </form>
        </Stack>
      </Container>
    </>
  );
};

export default Create;
