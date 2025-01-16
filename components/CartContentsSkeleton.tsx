import { Skeleton } from "@/components/ui/skeleton";

export function CartContentsSkeleton() {
  return (
    <div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center border-b py-4">
          <Skeleton className="w-[100px] h-[100px] rounded" />
          <div className="ml-4 flex-grow">
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <div className="flex items-center">
            <Skeleton className="w-16 h-10 mr-2" />
            <Skeleton className="w-20 h-10" />
          </div>
        </div>
      ))}
      <div className="mt-6 text-right">
        <Skeleton className="h-6 w-1/4 inline-block" />
        <Skeleton className="h-10 w-40 mt-4 inline-block" />
      </div>
    </div>
  );
}
