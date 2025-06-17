"use client";

import React, { useEffect, useState, useMemo } from "react";
import { ModalNotasFiscais, NotaFiscal } from "@/components/modalNotas";
import { Button, Box, Typography, TextField } from "@mui/material";
import { useAuth } from "@/Context/useAuth";

export default function Page() {
  const { getNotasAgrupadas } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [notasPorFantasia, setNotasPorFantasia] = useState<
    Record<string, NotaFiscal[]>
  >({});
  const [fantasias, setFantasias] = useState<string[]>([]);
  const [fantasiaSelecionada, setFantasiaSelecionada] = useState<string | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notasPagina, setNotasPagina] = useState<NotaFiscal[]>([]);
  const [loading, setLoading] = useState(false);

  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    async function fetchFantasias() {
      setLoading(true);
      try {
        const response = await getNotasAgrupadas(1, 1000);
        setNotasPorFantasia(response.data);
        setFantasias(Object.keys(response.data));
      } catch (error) {
        console.error("Erro ao carregar fantasias:", error);
        setNotasPorFantasia({});
        setFantasias([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFantasias();
  }, [getNotasAgrupadas]);

  useEffect(() => {
    if (!modalOpen || !fantasiaSelecionada) {
      setNotasPagina([]);
      setTotalPages(1);
      return;
    }

    async function fetchNotasPaginadas() {
      setLoading(true);
      try {
        const todasNotas = fantasiaSelecionada && notasPorFantasia[fantasiaSelecionada] 
          ? notasPorFantasia[fantasiaSelecionada] 
          : [];
        
        // Configurações de paginação
        const notasPorPagina = 5;
        const totalNotas = todasNotas.length;
        const totalPaginas = Math.ceil(totalNotas / notasPorPagina);
        
        const inicio = (currentPage - 1) * notasPorPagina;
        const fim = inicio + notasPorPagina;
        
        const notasPaginaAtual = todasNotas.slice(inicio, fim);
        
        setNotasPagina(notasPaginaAtual);
        setTotalPages(totalPaginas);
      } catch (error) {
        console.error("Erro ao carregar notas paginadas:", error);
        setNotasPagina([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }

    fetchNotasPaginadas();
  }, [modalOpen, fantasiaSelecionada, currentPage, notasPorFantasia]);

  const fantasiasFiltradas = useMemo(() => {
    const lowerFiltro = filtro.toLowerCase();
    return fantasias.filter((fantasia) =>
      fantasia.toLowerCase().includes(lowerFiltro)
    );
  }, [filtro, fantasias]);

  const abrirModalComNotas = (fantasia: string) => {
    setFantasiaSelecionada(fantasia);
    setCurrentPage(1);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-green-100 min-h-full">
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: "#1b5e20",
          textAlign: "center",
          mb: 4,
          userSelect: "none",
          width: "90%",
        }}
      >
        Selecione um Nome Fantasia para ver as Notas Fiscais
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3, px: 2 }}>
        <TextField
          label="Filtrar Nome Fantasia"
          variant="outlined"
          size="small"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          sx={{
            width: { xs: "100%", sm: 300 },
            "& label": { color: "#2e7d32" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#81c784" },
              "&:hover fieldset": { borderColor: "#388e3c" },
              "&.Mui-focused fieldset": { borderColor: "#1b5e20" },
            },
            input: { color: "#1b5e20" },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
          mb: 4,
          px: 2,
        }}
      >
        {loading && (
          <Typography
            variant="body1"
            sx={{ width: "100%", textAlign: "center", color: "#2e7d32" }}
          >
            Carregando...
          </Typography>
        )}

        {!loading && fantasiasFiltradas.length === 0 && (
          <Typography
            variant="body1"
            sx={{ width: "100%", textAlign: "center", color: "#2e7d32" }}
          >
            Nenhuma fantasia encontrada.
          </Typography>
        )}

        {!loading &&
          fantasiasFiltradas.map((fantasia) => (
            <Button
              key={fantasia}
              variant="outlined"
              onClick={() => abrirModalComNotas(fantasia)}
              title={fantasia}
              sx={{
                textTransform: "none",
                borderRadius: 3,
                fontWeight: 600,
                color: "#2e7d32", 
                borderColor: "#81c784", 
                px: 3,
                py: 1.5,
                boxShadow: "0 2px 6px rgba(46, 125, 50, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#81c784",
                  borderColor: "#1b5e20",
                  color: "#e8f5e9",
                  boxShadow: "0 4px 12px rgba(27, 94, 32, 0.5)",
                },
                flexShrink: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 200
              }}
            >
              <div className="truncate">{fantasia}</div>
            </Button>
          ))}
      </Box>

      <ModalNotasFiscais
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        notas={notasPagina}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        loading={loading}
      />
    </div>
  );
}