import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import type {
  DispositvoTipo,
  StatusDispositivo,
} from "../../interfaces/deviceInterface";

interface ModalCriarProps {
  onClose: () => void;
  onSuccess: () => void;
}

type SalaOption = {
  id: number;
  nome: string;
};

export function ModalCriarDispositivo({ onClose, onSuccess }: ModalCriarProps) {
  const [salvando, setSalvando] = useState(false);
  const [salas, setSalas] = useState<SalaOption[]>([]);
  const [tipoInventario, setTipoInventario] = useState<"create" | "update">(
    "create",
  );
  const [salaId, setSalaId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nomeDispositivo: "",
    tipoDispositivo: "NOTEBOOK" as DispositvoTipo,
    patrimonio: "",
    statusDispositivo: "ATIVO" as StatusDispositivo,
  });

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const response = await api.get<any>("/inventarios");
        const rawSalas = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
            ? response.data.data
            : [];
        const salasUnicas = rawSalas
          .map((item: any) => ({
            id: item.salaId,
            nome: item.salaNome || item.sala?.nomeSala || `Sala ${item.salaId}`,
          }))
          .filter(
            (v: SalaOption, i: number, a: SalaOption[]) =>
              a.findIndex((t) => t.id === v.id) === i,
          );
        setSalas(salasUnicas);
      } catch (error) {
        console.error("Erro ao buscar salas para inventário:", error);
      }
    };

    fetchSalas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!salaId) {
      alert("Selecione uma sala para associar o inventário.");
      return;
    }

    setSalvando(true);
    try {
      const payload = {
        dispositivo: {
          nomeDispositivo: formData.nomeDispositivo,
          tipoDispositivo: formData.tipoDispositivo,
          patrimonio: formData.patrimonio,
          statusDispositivo: formData.statusDispositivo,
        },
        inventario: {
          type: tipoInventario,
          data: {
            salaId,
            dispositivoIds: [],
          },
        },
      };

      await api.post("/atualizar-inventario", payload);
      alert("Sucesso!");
      onSuccess();
    } catch (error: any) {
      console.error(error);
      alert("Erro ao salvar");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#004A61]">
              Novo Dispositivo
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 font-bold text-xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ... Mesmos campos de INPUT do Modal de Editar ... */}
            <div>
              <label className="block text-xs font-bold text-[#004A61] uppercase mb-1">
                Nome
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#B20000]"
                value={formData.nomeDispositivo}
                onChange={(e) =>
                  setFormData({ ...formData, nomeDispositivo: e.target.value })
                }
              />
            </div>

            {/* Grid para Tipo e Patrimônio */}
            <div className="grid grid-cols-2 gap-4">
              {/* Select de Tipo e Input de Patrimônio iguais ao anterior */}
              <div>
                <label className="block text-xs font-bold text-[#004A61] uppercase mb-1">
                  Tipo
                </label>
                <select
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#B20000]"
                  value={formData.tipoDispositivo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipoDispositivo: e.target.value as DispositvoTipo,
                    })
                  }
                >
                  <option value="NOTEBOOK">Notebook</option>
                  <option value="DESKTOP">Desktop</option>
                  <option value="TV">TV</option>
                  <option value="PROJETOR">Projetor</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#004A61] uppercase mb-1">
                  Patrimônio
                </label>
                <input
                  type="text"
                  placeholder="Ex: 123456"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#B20000]"
                  value={formData.patrimonio}
                  onChange={(e) =>
                    setFormData({ ...formData, patrimonio: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <fieldset className="border border-gray-200 rounded-3xl p-4">
                <legend className="text-xs font-bold uppercase text-[#004A61]">
                  Inventário
                </legend>
                <div className="mt-3 flex flex-col gap-3">
                  <label className="inline-flex items-center gap-3">
                    <input
                      type="radio"
                      name="tipoInventario"
                      value="create"
                      checked={tipoInventario === "create"}
                      onChange={() => setTipoInventario("create")}
                      className="h-4 w-4 text-[#B20000]"
                    />
                    <span className="text-sm text-[#004A61]">
                      Criar novo inventário
                    </span>
                  </label>
                  <label className="inline-flex items-center gap-3">
                    <input
                      type="radio"
                      name="tipoInventario"
                      value="update"
                      checked={tipoInventario === "update"}
                      onChange={() => setTipoInventario("update")}
                      className="h-4 w-4 text-[#B20000]"
                    />
                    <span className="text-sm text-[#004A61]">
                      Atualizar inventário existente
                    </span>
                  </label>
                  <div>
                    <label className="block text-xs font-bold text-[#004A61] uppercase mb-1">
                      Sala
                    </label>
                    <select
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#B20000]"
                      value={salaId ?? ""}
                      onChange={(e) =>
                        setSalaId(
                          e.target.value ? parseInt(e.target.value, 10) : null,
                        )
                      }
                    >
                      <option value="">Selecione a sala</option>
                      {salas.map((sala) => (
                        <option key={sala.id} value={sala.id}>
                          {sala.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="flex-1 py-3 bg-[#004A61] text-white font-bold rounded-xl hover:bg-[#003546] shadow-lg"
              >
                {salvando ? "Criando..." : "Cadastrar Dispositivo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
