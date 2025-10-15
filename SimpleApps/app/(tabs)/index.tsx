// import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Button from "@/components/Button";
import ImageViewer from "@/components/ImageViewer";
import DocumentConverter from "@/components/DocumentConverter";
export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={require("@/assets/images/good-day.jpeg")} />
        {/* Create a DocViewer component to preview the document. */}
        {/* <View style={styles.footerContainer}>
          <Button label="A Button" theme="primary" />
        </View> */}
        <DocumentConverter label="Docx > PDF" fileFormat="pdf" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
});
