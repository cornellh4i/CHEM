import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-lg p-4 shadow">{children}</div>;
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold">{children}</h2>;
}

export function CardDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-500">{children}</p>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mt-4 ${className}`}>{children}</div>;
}
