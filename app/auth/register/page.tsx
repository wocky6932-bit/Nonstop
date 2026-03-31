"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function RegisterPage() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setIsLoading(false);
      return;
    }

    // Validation des champs requis
    if (!telephone.trim() || !adresse.trim() || !ville.trim()) {
      setError("Veuillez remplir tous les champs requis");
      setIsLoading(false);
      return;
    }

    try {
      // Créer l'utilisateur avec l'API route (MySQL)
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          nom,
          telephone,
          adresse,
          ville
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Compte créé avec succès ! Redirection...");
        // Redirect to profile after success
        setTimeout(() => {
          if (result.isAdmin) {
            window.location.href = '/admin';
          } else {
            window.location.href = '/profile';
          }
        }, 2000);
      } else {
        setError(result.error || "Une erreur est survenue");
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="w-full border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <Image 
                src="/nonstop-logo.png" 
                alt="Nonstop" 
                width={40} 
                height={40}
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-semibold text-black">NONSTOP</span>
            </Link>
            <Link href="/" className="text-sm text-gray-600 hover:text-black transition-colors">
              Retour à la boutique
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-light tracking-wide text-black">
              Créer un compte
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Rejoignez la communauté Nonstop
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nom" className="text-sm font-medium text-gray-700">
                  Nom complet *
                </Label>
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  placeholder="Votre nom complet"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Adresse email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="telephone" className="text-sm font-medium text-gray-700">
                  Téléphone *
                </Label>
                <Input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  placeholder="+221 77 000 00 00"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="adresse" className="text-sm font-medium text-gray-700">
                  Adresse *
                </Label>
                <Input
                  id="adresse"
                  name="adresse"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  placeholder="Votre adresse complète"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="ville" className="text-sm font-medium text-gray-700">
                  Ville *
                </Label>
                <Input
                  id="ville"
                  name="ville"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  placeholder="Dakar, Thies, etc."
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                />
              </div>
            </div>

            <div className="text-xs text-gray-500">
              * Champs obligatoires pour la livraison
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-600 text-sm text-center bg-green-50 border border-green-200 rounded-lg p-3">
                {success}
              </div>
            )}

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Création..." : "Créer mon compte"}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link 
                  href="/auth/login" 
                  className="font-medium text-black hover:text-gray-800 transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-xs text-gray-500">
            <p>© 2025 Nonstop. Tous droits réservés.</p>
            <div className="mt-2 space-x-4">
              <Link href="/privacy" className="hover:text-gray-700 transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/terms" className="hover:text-gray-700 transition-colors">
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}