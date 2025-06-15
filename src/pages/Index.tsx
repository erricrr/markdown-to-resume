import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Code, Leaf, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-4">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
            <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Paste to PDF
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                Create resumes with Markdown or HTML                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Editor
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Got a resume from AI in Markdown or HTML? Paste it in, polish it up, and export a clean PDF — while learning how the code shapes your layout.
        </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Markdown Editor Option */}
          <Card className="shadow-xl border-0 bg-white overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Markdown Editor</h3>
                  <p className="text-sm text-gray-600">Clean, structured content</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Resume templates with CSS customization</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Two-column layouts made easy</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Simple, readable markdown syntax</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Perfect for traditional resumes</span>
                </div>
              </div>

                            <Button
                onClick={() => navigate("/markdown")}
                className="w-full gap-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
              >
                Start with Markdown
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* HTML Editor Option */}
          <Card className="shadow-xl border-0 bg-white overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">HTML Editor</h3>
                  <p className="text-sm text-gray-600">Interactive, customizable</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Full HTML, CSS, and JavaScript support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Interactive elements and animations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Complete design freedom</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Perfect for creative professionals</span>
                </div>
              </div>

                            <Button
                onClick={() => navigate("/html")}
                className="w-full gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                Start with HTML
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            You can switch between editors anytime. Both support PDF export for professional printing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
