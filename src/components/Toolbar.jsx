import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
} from 'lexical';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaHeading,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaCode,
} from "react-icons/fa";
import { useDarkMode } from "../Context/DarkModeContext";

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const {isDarkMode} = useDarkMode();

  const apply = (command, value) => {
    editor.dispatchCommand(command, value);
  };

  const btnClass =
    "text-sm p-2 rounded hover:bg-blue-200 dark:hover:bg-blue-600 transition";

  return (
    <div className={`flex flex-wrap justify-center  gap-2 p-2 rounded  ${isDarkMode? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-800" } mb-4`}>
      <button className={btnClass} onClick={() => apply(FORMAT_TEXT_COMMAND, "bold")}><FaBold /></button>
      <button className={btnClass} onClick={() => apply(FORMAT_TEXT_COMMAND, "italic")}><FaItalic /></button>
      <button className={btnClass} onClick={() => apply(FORMAT_TEXT_COMMAND, "underline")}><FaUnderline /></button>
      <button className={btnClass} onClick={() => apply(FORMAT_TEXT_COMMAND, "strikethrough")}><FaStrikethrough /></button>
      <button className={btnClass} onClick={() => apply(FORMAT_ELEMENT_COMMAND, "heading")}><FaHeading /></button>
      <button className={btnClass} onClick={() => apply(FORMAT_ELEMENT_COMMAND, "left")}><FaAlignLeft /></button>
      <button className={btnClass} onClick={() => apply(FORMAT_ELEMENT_COMMAND, "center")}><FaAlignCenter /></button>
      <button className={btnClass} onClick={() => apply(FORMAT_ELEMENT_COMMAND, "right")}><FaAlignRight /></button>
      <button className={btnClass} onClick={() => apply(FORMAT_ELEMENT_COMMAND, "code")}><FaCode /></button>
    </div>
  );
};

export default Toolbar