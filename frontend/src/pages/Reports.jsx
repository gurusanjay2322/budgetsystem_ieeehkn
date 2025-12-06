import { useState } from "react";
import useAxios from "../hooks/useAxios";
import Card from "../components/Card";
import Button from "../components/Button";
import { FileText, Download, FileSpreadsheet } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default function Reports() {
    const { request } = useAxios();
    const [loading, setLoading] = useState(false);

    const fetchTransactions = async () => {
        return await request({ url: "/api/transactions", method: "GET" });
    };

    const exportPDF = async () => {
        setLoading(true);
        try {
            const transactions = await fetchTransactions();
            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.text("Financial Report", 14, 22);
            doc.setFontSize(11);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

            const tableColumn = ["Date", "Event", "Type", "Category", "Amount", "Status"];
            const tableRows = [];

            transactions.forEach((t) => {
                const transactionData = [
                    new Date().toLocaleDateString(), // Assuming transaction has date, or use created_at
                    t.eventName || "N/A",
                    t.type,
                    t.category,
                    `$${t.amount}`,
                    t.status,
                ];
                tableRows.push(transactionData);
            });

            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                theme: 'grid',
                styles: { fontSize: 8 },
                headStyles: { fillColor: [26, 29, 108] } // hkn-navy
            });

            doc.save("financial_report.pdf");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = async () => {
        setLoading(true);
        try {
            const transactions = await fetchTransactions();

            const worksheet = XLSX.utils.json_to_sheet(transactions);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

            XLSX.writeFile(workbook, "financial_report.xlsx");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-hkn-navy">Reports</h1>
                <p className="text-sm text-gray-500">Generate and download financial statements</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                    <div className="p-4 bg-red-50 text-hkn-red rounded-full mb-4">
                        <FileText size={48} />
                    </div>
                    <h2 className="text-xl font-bold text-hkn-navy mb-2">PDF Report</h2>
                    <p className="text-gray-500 mb-6">Download a printable PDF version of your financial transactions and budget status.</p>
                    <Button onClick={exportPDF} disabled={loading} className="w-full max-w-xs">
                        <Download size={18} className="mr-2" />
                        {loading ? "Generating..." : "Download PDF"}
                    </Button>
                </Card>

                <Card className="p-8 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                    <div className="p-4 bg-green-50 text-green-600 rounded-full mb-4">
                        <FileSpreadsheet size={48} />
                    </div>
                    <h2 className="text-xl font-bold text-hkn-navy mb-2">Excel / CSV Export</h2>
                    <p className="text-gray-500 mb-6">Export raw data to Excel or CSV for further analysis in spreadsheet software.</p>
                    <Button onClick={exportCSV} variant="outline" disabled={loading} className="w-full max-w-xs">
                        <Download size={18} className="mr-2" />
                        {loading ? "Exporting..." : "Download Excel"}
                    </Button>
                </Card>
            </div>
        </div>
    );
}
