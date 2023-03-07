import { useContext, useState } from "react";
import { AlertContext } from "../contexts/AlertContext";
import { generateReportWithAttachments } from "../utils/mail";


interface GenerateReportProps {
    items: any[];
}

const useGenerateReport = ({ items }: GenerateReportProps) => {
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const { addAlert } = useContext(AlertContext);

    if (!items) {
        throw new Error("No items passed to useGenerateReport");
    }
    const generateReport = async () => {
        setIsGeneratingReport(true);
        const status = await generateReportWithAttachments(items);
        setIsGeneratingReport(false);
        return status;
    };

    const generateReportAndAlert = async () => {
        const status = await generateReport();
        if (status.type === "success") {
            addAlert({ ...status, position: "top-center" });
        } else {
            addAlert({ ...status, position: "top-center" });
        }
    };

    return [isGeneratingReport, generateReportAndAlert];
};

export default useGenerateReport;