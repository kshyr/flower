import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  AreaChart,
  Area,
  CartesianGrid,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "./theme-provider";

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
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  const { theme } = useTheme();
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
    <div className="flex h-screen max-h-screen bg-background">
      {/* Thin Sidebar Navigation */}
      <aside className="max-h-screen sticky top-0 w-16 bg-card shadow-md flex flex-col items-center py-4">
        <div className="mb-8 flex flex-col gap-4">
          <Flower className="h-8 w-8 text-primary" />
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
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-6 h-6" />
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <ModeToggle />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full max-h-screen overflow-y-scroll bg-background p-6">
        <div className="bg-background text-foreground p-6">
          <h1 className="text-3xl font-bold mb-6">Flower Dashboard</h1>

          {data.alerts.map((alert, index) => (
            <div
              key={index}
              className="bg-destructive text-destructive-foreground p-4 rounded-lg mb-4"
            >
              <AlertCircle className="inline-block mr-2" />
              {alert.message}
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Net Worth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  ${(data.assets - data.liabilities).toLocaleString()}
                </div>
                <p className="text-muted-foreground">+$1,000 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  ${data.assets.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Liabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  ${data.liabilities.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Cash Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  ${(data.income - data.expenses).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Area Chart - Stacked</CardTitle>
                <CardDescription>
                  Showing total visitors for the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Area
                      dataKey="mobile"
                      type="natural"
                      fill="var(--color-mobile)"
                      fillOpacity={0.4}
                      stroke="var(--color-mobile)"
                      stackId="a"
                    />
                    <Area
                      dataKey="desktop"
                      type="natural"
                      fill="var(--color-desktop)"
                      fillOpacity={0.4}
                      stroke="var(--color-desktop)"
                      stackId="a"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
              <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 font-medium leading-none">
                      Trending up by 5.2% this month{" "}
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-2 leading-none text-muted-foreground">
                      January - June 2024
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.assetAllocation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {data.assetAllocation.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(var(--chart-${index + 1}))`}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
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
                        <TableCell>
                          ${Math.abs(transaction.amount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.type === "Income"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {transaction.type}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mt-6">
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
                  value={newTransaction.type}
                  onValueChange={(value) =>
                    setNewTransaction({ ...newTransaction, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
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
      </main>
    </div>
  );
}
