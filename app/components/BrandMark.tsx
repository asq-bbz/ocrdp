type BrandMarkProps = {
  className?: string;
  animate?: boolean;
};

/**
 * Glifo 2x2 — elemento de assinatura do app.
 * Ecoa a grade de quadrados da marca BBZ sem reproduzir o logotipo.
 * Quando `animate` está ativo, os quadrados acendem em sequência
 * (usado no estado de envio do formulário).
 */
export function BrandMark({ className = "", animate = false }: BrandMarkProps) {
  const cells = [0, 1, 2, 3];
  return (
    <div
      className={`grid grid-cols-2 gap-[3px] ${className}`}
      role="img"
      aria-label="BBZ"
    >
      {cells.map((i) => (
        <span
          key={i}
          className={`block rounded-[2px] bg-current ${
            animate ? "animate-pulse" : ""
          }`}
          style={
            animate
              ? { animationDelay: `${i * 150}ms`, animationDuration: "1.2s" }
              : undefined
          }
        />
      ))}
    </div>
  );
}
