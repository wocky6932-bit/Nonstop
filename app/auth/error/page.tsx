import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Désolé, une erreur est survenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                <p className="text-sm text-muted-foreground">
                  Code erreur: {params.error}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Une erreur non spécifiée est survenue
                </p>
              )}
              <Link href="/" className="text-sm underline mt-4 block">
                Retour à l'accueil
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
