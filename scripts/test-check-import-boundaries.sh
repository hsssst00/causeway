#!/usr/bin/env bash
# Caso de prueba de scripts/check-import-boundaries.sh (Hallazgo B1,
# auditoría independiente 2026-08-03; corrige historia 4 de E1, Doc. 4 §7:
# "una regla de importación violada rompe el build; caso de prueba
# incluido"). Construye fixtures sintéticos temporales — no toca
# packages/ real — y verifica que el script detecta una importación
# prohibida y acepta una permitida.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT="$DIR/check-import-boundaries.sh"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

fallos=0

caso_prohibido() {
  local escenario="$1"
  rm -rf "$TMP/repo"
  mkdir -p "$TMP/repo/packages/cre/src"
  cat > "$TMP/repo/packages/cre/src/motor.ts" <<'EOF'
import { algo } from '../../ate/src/index';
EOF
  if "$SCRIPT" "$TMP/repo" >/tmp/out.log 2>&1; then
    echo "FALLO ($escenario): el script debía rechazar cre importando de ate, pero salió con código 0."
    cat /tmp/out.log
    fallos=1
  else
    echo "OK ($escenario): el script rechaza correctamente cre -> ate."
  fi
}

caso_permitido() {
  local escenario="$1"
  rm -rf "$TMP/repo"
  mkdir -p "$TMP/repo/packages/cre/src"
  cat > "$TMP/repo/packages/cre/src/motor.ts" <<'EOF'
import { validarDocumento } from '../../cks/validate/index';
EOF
  if "$SCRIPT" "$TMP/repo" >/tmp/out.log 2>&1; then
    echo "OK ($escenario): el script acepta correctamente cre -> cks/validate."
  else
    echo "FALLO ($escenario): el script rechazó una importación permitida (cre -> cks/validate)."
    cat /tmp/out.log
    fallos=1
  fi
}

caso_prohibido "cre importa de ate (Doc. 0 §4.1, §4.5)"
caso_permitido "cre importa de cks/validate"

if [ "$fallos" -ne 0 ]; then
  echo "Prueba de check-import-boundaries.sh: FALLÓ."
  exit 1
fi
echo "Prueba de check-import-boundaries.sh: todos los casos pasaron."
