import CustomerSignupForm from "@/components/CustomerSignupForm";

export default function SignupPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <CustomerSignupForm />
      </div>
    </div>
  );
}
