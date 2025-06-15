import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TipTooltip } from "./UsageTips";
import { Code } from "lucide-react";

interface CSSEditorProps {
  onCSSChange: (css: string) => void;
  initialCSS: string;
  /** The CSS string that represents your true default. Used for Reset button */
  defaultCSS: string;
}

export const CSSEditor: React.FC<CSSEditorProps> = ({ onCSSChange, initialCSS, defaultCSS }) => {
  const [css, setCss] = useState(initialCSS);
  const { toast } = useToast();
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setCss(initialCSS);
  }, [initialCSS]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleApply = () => {
    onCSSChange(css);
    toast({
      title: "CSS Applied",
      description: "Your custom styles have been updated in the live preview.",
    });
  };

  const handleReset = () => {
    // Revert to the base default CSS rather than whatever was last applied
    setCss(defaultCSS);
    onCSSChange(defaultCSS);
    toast({
      title: "CSS Reset",
      description: "The styles have been reset to their default values.",
    });
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-primary shrink-0" />
            <h3 className="text-base font-semibold text-foreground truncate">Custom CSS</h3>
        </div>
        <TipTooltip type="css" />
      </div>
      <div className="flex-1 min-h-0 border rounded-md overflow-hidden">
        <Editor
          height="100%"
          language="css"
          value={css}
          onChange={(value) => setCss(value || "")}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </div>
      <div className="flex justify-end gap-2 mt-4 shrink-0">
        <Button onClick={handleApply} size="sm">
          Apply Styles
        </Button>
        <Button onClick={handleReset} variant="outline" size="sm">
          Reset to Default
        </Button>
      </div>
    </div>
  );
};
