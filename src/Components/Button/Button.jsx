import React from "react";
import styled, { css } from "styled-components";

function Button({
  name,
  children,
  icon,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  block = false,
  disabled = false,
  className,
  ariaLabel,
  bg,
  bPad,
  color,
  bRad,
}) {
  const inlineStyle = {};
  if (bg) inlineStyle.background = bg;
  if (bPad) inlineStyle.padding = bPad;
  if (bRad) inlineStyle.borderRadius = bRad;
  if (color) inlineStyle.color = color;

  return (
    <ButtonStyled
      type={type}
      onClick={onClick}
      $variant={variant}
      $size={size}
      $block={block}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
      style={inlineStyle}
    >
      {icon && <span className="btn-icon-slot">{icon}</span>}
      {name || children}
    </ButtonStyled>
  );
}

const sizes = {
  sm: css`
    height: 32px;
    padding: 0 12px;
    font-size: 13px;
  `,
  md: css`
    height: 40px;
    padding: 0 var(--s-4);
    font-size: 14px;
  `,
  lg: css`
    height: 44px;
    padding: 0 var(--s-4);
    font-size: 14px;
  `,
};

const variants = {
  primary: css`
    background: var(--fg);
    color: #0b0d10;
    border-color: transparent;
    &:hover:not(:disabled) {
      opacity: 0.92;
    }
  `,
  secondary: css`
    background: var(--bg-inset);
    color: var(--fg);
    border-color: var(--line-strong);
    &:hover:not(:disabled) {
      background: var(--bg-inset-2);
    }
  `,
  ghost: css`
    background: transparent;
    color: var(--fg-muted);
    border-color: var(--line);
    &:hover:not(:disabled) {
      color: var(--fg);
    }
  `,
  danger: css`
    background: transparent;
    color: var(--accent-expense);
    border-color: rgba(232, 60, 50, 0.3);
    &:hover:not(:disabled) {
      background: rgba(232, 60, 50, 0.1);
    }
  `,
};

const ButtonStyled = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--s-2);
  border-radius: var(--r-sm);
  border: 1px solid transparent;
  font-family: inherit;
  font-weight: 700;
  letter-spacing: -0.005em;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 120ms ease, opacity 120ms ease, background 120ms ease,
    color 120ms ease, border-color 120ms ease;
  outline: none;

  ${({ $size }) => sizes[$size] || sizes.md}
  ${({ $variant }) => variants[$variant] || variants.primary}
  ${({ $block }) =>
    $block &&
    css`
      width: 100%;
    `}

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
  }

  .btn-icon-slot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9em;
  }
`;

export default Button;
