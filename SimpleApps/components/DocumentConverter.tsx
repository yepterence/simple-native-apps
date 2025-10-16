import * as DocumentPicker from "expo-document-picker";
import Button from "./Button";
import { fetch } from "expo/fetch";

const allowedExt = ["pdf", "docx"];

const getExt = (filename: string) => {
  if (!filename) {
    return null;
  }
  const parts = filename.split(".");
  const ext = parts.length > 1 ? parts.pop() : null;
  return ext ? ext.toLowerCase() : null;
};

const pickDoc = async () => {
  try {
    const res = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (res.canceled || !res) {
      console.log("Cancelled document picking.");
      return null;
    }
    const assetName: string = res?.assets[0]?.name!;
    const ext: string = getExt(assetName)!;

    if (!allowedExt.includes(ext)) {
      alert("Only docx and pdf files are allowed");
      return null;
    }

    console.log("Picked file: ", assetName);
    return res;
  } catch (error) {
    console.error("Document pick error: ", error);
    return null;
  }
};

const convertDoc = async (targetFile: File, targetFormat: string) => {
  const url = "http://localhost:3000/convert";
  const formData = new FormData();

  formData.append("file", targetFile);
  formData.append("targetFormat", targetFormat);
  const resp = await fetch(url, {
    method: "POST",
    body: formData,
  });
  if (!resp.ok) {
    throw new Error(`Response status: ${resp.status} ${resp}`);
  }
  const blob = await resp.blob();
  const fileURL = URL.createObjectURL(blob);
  window.open(fileURL);
};

type Props = {
  label: string;
  fileFormat: string;
};

export default function DocumentConverter({ label, fileFormat }: Props) {
  const handlePress = async () => {
    const pickObj = await pickDoc();
    if (pickObj?.canceled) {
      return null;
    }
    if (pickObj?.assets) {
      await convertDoc(pickObj.assets[0].file!, fileFormat);
    }
  };
  return <Button label={label} theme="primary" onPress={handlePress} />;
}
