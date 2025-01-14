import CustomerForm from "@/components/admin/CustomerForm";
import { getCustomerSegments } from "@/app/actions/customer-segment";

export default async function NewCustomerPage() {
  const segments = await getCustomerSegments();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Add New Customer</h1>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <CustomerForm segments={segments} />
      </div>
    </div>
  );
}
