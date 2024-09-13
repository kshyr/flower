import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  LayoutDashboard,
  FileText,
  PieChart as PieChartIcon,
  Settings,
  AlertCircle,
  Flower,
} from "lucide-react";

// Mock data - replace with actual data from Beancount file in a real application
const initialData = {
  assets: 50000,
  liabilities: 20000,
  income: 5000,
  expenses: 3000,
  netWorthHistory: [
    { date: "2023-01-01", value: 25000 },
    { date: "2023-02-01", value: 26000 },
    { date: "2023-03-01", value: 27000 },
    { date: "2023-04-01", value: 28000 },
    { date: "2023-05-01", value: 29000 },
    { date: "2023-06-01", value: 30000 },
  ],
  assetAllocation: [
    { name: "Cash", value: 10000 },
    { name: "Stocks", value: 25000 },
    { name: "Real Estate", value: 15000 },
  ],
  recentTransactions: [
    { date: "2023-06-01", description: "Salary", amount: 5000, type: "Income" },
    { date: "2023-06-02", description: "Rent", amount: -1500, type: "Expense" },
    {
      date: "2023-06-03",
      description: "Groceries",
      amount: -200,
      type: "Expense",
    },
    {
      date: "2023-06-04",
      description: "Freelance Work",
      amount: 1000,
      type: "Income",
    },
    {
      date: "2023-06-05",
      description: "Utilities",
      amount: -150,
      type: "Expense",
    },
  ],
  alerts: [
    { type: "warning", message: "Unusual expense: $500 at Electronics Store" },
    { type: "info", message: "Upcoming bill: Electricity $120 due in 3 days" },
  ],
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  const [data, setData] = useState(initialData);
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    description: "",
    amount: "",
    type: "",
  });
  const [activePage, setActivePage] = useState("dashboard");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amount =
      newTransaction.type === "Expense"
        ? -Number(newTransaction.amount)
        : Number(newTransaction.amount);
    const updatedTransactions = [
      { ...newTransaction, amount },
      ...data.recentTransactions,
    ];
    setData({
      ...data,
      recentTransactions: updatedTransactions,
      assets:
        newTransaction.type === "Income" ? data.assets + amount : data.assets,
      liabilities:
        newTransaction.type === "Expense"
          ? data.liabilities - amount
          : data.liabilities,
      income:
        newTransaction.type === "Income"
          ? data.income + Number(newTransaction.amount)
          : data.income,
      expenses:
        newTransaction.type === "Expense"
          ? data.expenses + Number(newTransaction.amount)
          : data.expenses,
    });
    setNewTransaction({ date: "", description: "", amount: "", type: "" });
  };

  return (
    <div className="flex h-screen max-h-screen bg-gray-100">
      {/* Thin Sidebar Navigation */}
      <aside className="max-h-screen sticky top-0 w-16 bg-white shadow-md flex flex-col items-center py-4">
        <div className="mb-8">
          <Flower className="h-8 w-8 text-purple-600" />
        </div>
        <nav className="flex flex-col items-center space-y-4">
          {[
            { icon: LayoutDashboard, id: "dashboard" },
            { icon: FileText, id: "transactions" },
            { icon: PieChartIcon, id: "reports" },
            { icon: Settings, id: "settings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`p-2 rounded-lg ${
                activePage === item.id
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-6 h-6" />
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full max-h-screen overflow-y-scroll bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">
              Flower Dashboard
            </h1>
            <Badge variant="outline" className="text-sm">
              Beancount File: financial_data.beancount
            </Badge>
          </div>

          {/* Alerts Section */}
          <div className="mb-6">
            {data.alerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-center p-4 mb-2 rounded-lg ${
                  alert.type === "warning"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{alert.message}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(data.assets - data.liabilities).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +$1,000 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Assets
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${data.assets.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Liabilities
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${data.liabilities.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Cash Flow
                </CardTitle>
                <PiggyBank className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(data.income - data.expenses).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Net Worth Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.netWorthHistory}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.assetAllocation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {data.assetAllocation.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentTransactions
                      .slice(0, 5)
                      .map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell
                            className={
                              transaction.amount < 0
                                ? "text-red-500"
                                : "text-green-500"
                            }
                          >
                            ${Math.abs(transaction.amount).toLocaleString()}
                          </TableCell>
                          <TableCell>{transaction.type}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Add Transaction</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="date"
                    name="date"
                    value={newTransaction.date}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={newTransaction.description}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={newTransaction.amount}
                    onChange={handleInputChange}
                    required
                  />
                  <Select
                    name="type"
                    onValueChange={(value) =>
                      setNewTransaction({ ...newTransaction, type: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Transaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Income">Income</SelectItem>
                      <SelectItem value="Expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="submit">Add Transaction</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
