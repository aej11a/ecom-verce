import { notFound } from "next/navigation";
import CustomerForm from "@/components/admin/CustomerForm";
import { getCustomerById } from "@/app/actions/customer";
import { getCustomerSegments } from "@/app/actions/customer-segment";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [customer, segments] = await Promise.all([
    getCustomerById(parseInt((await params).id)),
    getCustomerSegments(),
  ]);

  if (!customer) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Customer</h1>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        {/** @ts-expect-error need to fix mismatch in customer type due to segments */}
        <CustomerForm customer={customer} segments={segments} />
      </div>
    </div>
  );
}
