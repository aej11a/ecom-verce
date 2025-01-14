import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Create New Category
      </h1>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <CategoryForm />
      </div>
    </div>
  );
}
