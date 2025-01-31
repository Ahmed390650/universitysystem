"use client";
import config from "@/lib/config";
import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
import { useRef, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
const {
  env: {
    imageKit: { publicKey, urlEndpoint },
    prodApiEndpoint,
  },
} = config;
const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);
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
interface Props {
  type: "video" | "image";
  floder: string;
  accept: string; // "image/*" | "video/*"
  placeholder: string;
  variant: "light" | "dark";
  value?: string;
  onFileChange: (file: { filePath: string }) => void;
}
const FileUpload = ({
  onFileChange,
  accept,
  floder,
  placeholder,
  variant,
  type,
  value,
}: Props) => {
  const IKImageRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const isDark = variant === "dark";
  const styles = {
    button: isDark ? "bg-dark-300" : "bg-light-600 border-gray-100 border",
    placeholder: isDark ? "text-light-100" : "text-slate-500",
    text: isDark ? "text-light-100" : "text-dark-400",
  };
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
    onFileChange(res.filePath);
    toast({
      title: "Success",
      description: `${type} File uploaded successfully`,
    });
  };
  const onValidateFile = (file: File) => {
    if (type === "image") {
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File size too large",
          description: "Please upload a file that is less than 20MB in size",
          variant: "destructive",
        });
        return false;
      }
    } else if (type === "video") {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File size too large",
          description: "Please upload a file that is less than 50MB in size",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };
  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}>
      <IKUpload
        ref={IKImageRef}
        className="hidden"
        onError={onError}
        useUniqueFileName={true}
        folder={floder}
        accept={accept}
        onUploadStart={() => {
          setProgress(0);
          setFile(null);
        }}
        validateFile={onValidateFile}
        onUploadProgress={({ loaded, total }) => {
          const percent = Math.round((loaded / total) * 100);
          setProgress(percent);
        }}
        onSuccess={onSuccess}
      />
      <button
        className={cn("upload-btn", styles.button)}
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
        <p className={cn("text-base text-light-100", styles.placeholder)}>
          {placeholder}
        </p>
        {file && (
          <p className={cn("upload-fileName", styles.text)}>{file.filePath}</p>
        )}
      </button>
      {progress > 0 && progress < 100 && (
        <div className="w-full bg-green-200 rounded-full">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}
      {file &&
        (type === "image" ? (
          <IKImage
            alt={file.filePath}
            path={file.filePath}
            width={500}
            height={300}
          />
        ) : type === "video" ? (
          <IKVideo
            path={file?.filePath}
            controls={true}
            className="h-96 w-full rounded-xl"
          />
        ) : null)}
    </ImageKitProvider>
  );
};

export default FileUpload;
