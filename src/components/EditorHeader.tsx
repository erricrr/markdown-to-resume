import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Home, FileText, Code } from 'lucide-react';

interface EditorHeaderProps {
  title: string;
  description: string;
  icon: ReactNode;
  iconBgColor: string;
  alternateEditorPath: string;
  alternateEditorIcon: ReactNode;
  alternateEditorLabel: string;
  alternateEditorColor: string;
  children?: ReactNode;
}

export const EditorHeader = ({
  title,
  description,
  icon,
  iconBgColor,
  alternateEditorPath,
  alternateEditorIcon,
  alternateEditorLabel,
  alternateEditorColor,
  children
}: EditorHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
              {icon}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                {description}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Home Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Home"
                  onClick={() => navigate("/")}
                  className="bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white border-0 hover:text-white hidden sm:flex items-center gap-2 font-bold"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Go to Home</TooltipContent>
            </Tooltip>

            {/* Mobile Home Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Home"
                  onClick={() => navigate("/")}
                  className="bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white border-0 hover:text-white sm:hidden font-bold"
                >
                  <Home className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Go to Home</TooltipContent>
            </Tooltip>

            {/* Switch to Alternate Editor Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={alternateEditorLabel}
                  onClick={() => navigate(alternateEditorPath)}
                  className={`${alternateEditorColor} hover:opacity-90 hidden sm:flex items-center gap-2 font-bold text-white border-0 hover:text-white`}
                >
                  {alternateEditorIcon}
                  <span>{alternateEditorLabel}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Switch to {alternateEditorLabel}</TooltipContent>
            </Tooltip>

            {/* Mobile Alternate Editor Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={alternateEditorLabel}
                  onClick={() => navigate(alternateEditorPath)}
                  className={`${alternateEditorColor} hover:opacity-90 sm:hidden font-bold text-white border-0 hover:text-white`}
                >
                  {alternateEditorIcon}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Switch to {alternateEditorLabel}</TooltipContent>
            </Tooltip>

            {children}
          </div>
        </div>
      </div>
    </header>
  );
};
