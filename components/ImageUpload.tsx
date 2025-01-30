"use client";
import config from "@/lib/config";
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import { useRef, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

const {
  env: {
    imageKit: { publicKey, urlEndpoint },
    prodApiEndpoint,
  },
} = config;
const authenticator = async () => {
  try {
    const response = await fetch(
      config.env.apiEndpoint + `${prodApiEndpoint}/api/auth/imagekit`
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status: ${response.status} ${errorText}`
      );
    }
    const { signature, expire, token } = await response.json();
    return { signature, expire, token };
  } catch (error: any) {
    throw new Error(`Authentication request failed :${error.message}`);
  }
};
const ImageUpload = ({
  onChange,
}: {
  onChange: (file: { filePath: string }) => void;
}) => {
  const IKImageRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);
  const { toast } = useToast();
  const onError = (error: any) => {
    console.log(error);
    toast({
      title: "Error",
      description: "Something went wrong " + error.message,
      variant: "destructive",
    });
  };
  const onSuccess = (res: any) => {
    setFile(res);
    onChange(res.filePath);
    toast({
      title: "Success",
      description: "File uploaded successfully",
    });
  };
  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}>
      <IKUpload
        className="hidden"
        ref={IKImageRef}
        onError={onError}
        onUploadProgress={(e) => {}}
        onSuccess={onSuccess}
        fileName="test-upload.png"
      />
      <button
        className="upload-btn"
        onClick={(e) => {
          e.preventDefault();
          if (IKImageRef.current) {
            // @ts-ignore
            IKImageRef.current?.click();
          }
        }}>
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          className="object-contain"
          height={20}
        />
        <p className="text-base text-light-100">Upload a File</p>
        {file && <p className="upload-fileName">{file.filePath}</p>}
      </button>
      {file && (
        <IKImage
          alt={file.filePath}
          path={file.filePath}
          width={500}
          height={300}
        />
      )}
    </ImageKitProvider>
  );
};

export default ImageUpload;
