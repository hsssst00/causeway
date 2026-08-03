#!/usr/bin/env bash
# Ref.: Doc. 5 §2.1 (tabla de dependencias por paquete), Doc. 0 §4.
#
# Lógica de fronteras de importación extraída de .ci/fronteras.yml
# (job import-boundaries) para que sea invocable y testeable de forma
# aislada, sin depender de que exista código real en packages/*/src ni
# de correr dentro de un workflow de CI (Hallazgo B1 de la auditoría
# independiente de 2026-08-03).
#
# Uso: check-import-boundaries.sh <carpeta-raiz>
#   <carpeta-raiz> debe contener una subcarpeta packages/ con la misma
#   forma que el repositorio real (packages/<paquete>/src). Se usa tanto
#   contra el repo real (carpeta-raiz = .) como contra fixtures sintéticos
#   temporales en los tests (scripts/test-check-import-boundaries.sh).
set -euo pipefail

RAIZ="${1:?Uso: check-import-boundaries.sh <carpeta-raiz-con-packages/*/src>}"
FALLO=0

verificar() {
  local paquete="$1" patron="$2" motivo="$3"
  local dir="$RAIZ/packages/$paquete/src"
  [ -d "$dir" ] || return 0
  if grep -rlE "$patron" "$dir" 2>/dev/null | grep -q .; then
    echo "::error::packages/$paquete $motivo"
    FALLO=1
  fi
}

# Tabla de Doc. 5 §2.1 — un bloque por paquete origen.
verificar cre "from ['\"](\.\./)*(ate|lsm|api|policylab-client)" "importa un paquete no permitido (Doc. 0 §4.1, §4.5)"
verificar ate "from ['\"](\.\./)*(policylab-client)" "importa policylab-client (Doc. 0 §3.4)"
verificar lsm "from ['\"](\.\./)*(cre|ate|policylab-client)" "importa un paquete no permitido (Doc. 0 §3.5)"
verificar api "from ['\"](\.\./)*(policylab-client)" "importa policylab-client (Doc. 0 §4.4)"
verificar policylab-client "from ['\"](\.\./)*(cre|ate|lsm)['\"/]" "importa un motor directamente (Doc. 0 §4.4)"

if [ "$FALLO" -eq 1 ]; then
  exit 1
fi
echo "Fronteras verificadas sin violaciones."
