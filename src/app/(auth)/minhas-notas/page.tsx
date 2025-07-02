"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useAuth } from "@/Context/useAuth";

export interface NotaFiscal {
  id: string;
  xml: string;
  dateEmissao: string; // Agora explicitamente YYYY-MM-DD
  value: number;
  noteNumber: string;
  corporateReason: string;
  fantasyName: string;
  userId: string;
  chaveDeAcesso: string;
}

const NotasPage: React.FC = () => {
  const { user, findMyNotes } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [notes, setNotes] = useState<NotaFiscal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);
  const [totalValue, setTotalValue] = useState(0); 

  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [startDate, setStartDate] = useState(""); 
  const [endDate, setEndDate] = useState("");   

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 5;

  const fetchNotes = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await findMyNotes(currentPage, ITEMS_PER_PAGE);
      
      const filteredData = response.data.filter((nota: NotaFiscal) => {
        const value = nota.value;
        
        const noteDate = new Date(nota.dateEmissao + 'T00:00:00'); 

        const min = minValue ? parseFloat(minValue) : -Infinity;
        const max = maxValue ? parseFloat(maxValue) : Infinity;
        
        const start = startDate ? new Date(startDate + 'T00:00:00') : new Date('1900-01-01T00:00:00');
        const end = endDate ? new Date(endDate + 'T23:59:59.999') : new Date('9999-12-31T23:59:59.999');

        noteDate.setHours(0,0,0,0); 
        start.setHours(0,0,0,0);
        end.setHours(23,59,59,999);

        return (
          value >= min &&
          value <= max &&
          noteDate >= start &&
          noteDate <= end
        );
      });

      setNotes(filteredData); 
      setTotalNotes(response.total); 
      setTotalValue(response.totalValue || 0); 
      setTotalPages(response.lastPage); 

    } catch (err: any) {
      console.error("Erro ao buscar notas fiscais:", err);
      setError(err.message || "Ocorreu um erro inesperado ao carregar as notas.");
    } finally {
      setLoading(false);
    }
  }, [user, currentPage, minValue, maxValue, startDate, endDate, ITEMS_PER_PAGE]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleDownloadXML = (xml: string, noteNumber: string) => {
    const blob = new Blob([xml], { type: "text/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nota-${noteNumber}.xml`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleCopyChave = (chave: string, id: string) => {
    navigator.clipboard.writeText(chave).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('pt-BR'); // month - 1 é crucial
  };

  if (!user) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gray-50">
        <Box className="text-center">
          <Typography variant="h5" component="h2" color="text.secondary" mb={1}>
            Acesso Restrito
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Você precisa estar logado para visualizar as notas fiscais.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen w-full bg-gray-50">
      <Box className="container mx-auto px-4 py-8">

        {/* Mensagem de Erro */}
        {error && (
          <Box mb={2} p={2} bgcolor="error.main" color="error.contrastText" borderRadius={1}>
            <Box display="flex" alignItems="center">
              <Typography component="span" sx={{ mr: 1, fontSize: '1.25rem' }}>⚠️</Typography>
              <Typography fontWeight="medium">Erro Inesperado. Por favor, tente novamente mais tarde.</Typography>
            </Box>
          </Box>
        )}

        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          gap={2}
          mb={3}
          p={3}
          bgcolor="white"
          borderRadius={2}
          boxShadow={1}
        >
          <TextField
            label="Valor Mínimo"
            type="number"
            fullWidth={isMobile}
            size="small"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            inputProps={{ step: "0.01" }}
          />
          <TextField
            label="Valor Máximo"
            type="number"
            fullWidth={isMobile}
            size="small"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            inputProps={{ step: "0.01" }}
          />
          <TextField
            label="Data Inicial"
            type="date"
            fullWidth={isMobile}
            size="small"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            label="Data Final"
            type="date"
            fullWidth={isMobile}
            size="small"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Box>

        {/* Tabela de Notas Fiscais */}
        <Box className="bg-white rounded-lg shadow-sm p-6">
          <Box mb={3}>
            <Typography variant="h5" component="h2" color="text.primary" mb={1}>
              Lista de Notas Fiscais
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Visualize, filtre e gerencie suas notas fiscais.
            </Typography>
          </Box>
         
          <Box sx={{ overflowX: "auto" }}>
            {notes.length === 0 && !loading && !error ? (
                <Typography align="center" color="textSecondary" sx={{ py: 4 }}>
                    Nenhuma nota encontrada com os filtros aplicados.
                </Typography>
            ) : (
                <Table size={isMobile ? "small" : "medium"} sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                    <TableCell>Número</TableCell>
                    <TableCell>Valor (R$)</TableCell>
                    <TableCell>Data Emissão</TableCell>
                    <TableCell sx={{ display: isMobile ? "none" : "table-cell" }}>
                        Razão Social
                    </TableCell>
                    <TableCell sx={{ display: isMobile ? "none" : "table-cell" }}>
                        Nome Fantasia
                    </TableCell>
                    <TableCell sx={{ display: isMobile ? "none" : "table-cell" }}>
                        Chave de Acesso
                    </TableCell>
                    <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {notes.map((nota) => (
                    <TableRow key={nota.id} hover>
                        <TableCell>{nota.noteNumber}</TableCell>
                        <TableCell>R$ {nota.value.toFixed(2).replace('.', ',')}</TableCell>
                        <TableCell>{formatDate(nota.dateEmissao)}</TableCell>
                        <TableCell sx={{ display: isMobile ? "none" : "table-cell" }}>
                        {nota.corporateReason}
                        </TableCell>
                        <TableCell sx={{ display: isMobile ? "none" : "table-cell" }}>
                        {nota.fantasyName}
                        </TableCell>
                        <TableCell sx={{ display: isMobile ? "none" : "table-cell" }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography
                            sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: 180,
                            }}
                            title={nota.chaveDeAcesso}
                            >
                            {nota.chaveDeAcesso}
                            </Typography>
                            <Tooltip title={copiedId === nota.id ? "Copiado!" : "Copiar"}>
                            <IconButton
                                onClick={() => handleCopyChave(nota.chaveDeAcesso, nota.id)}
                                size="small"
                            >
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                            </Tooltip>
                        </Box>
                        </TableCell>
                        <TableCell>
                        {isMobile ? (
                            <Tooltip title="Baixar XML">
                                <IconButton
                                    size="small"
                                    onClick={() => handleDownloadXML(nota.xml, nota.noteNumber)}
                                >
                                    <DownloadIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={() => handleDownloadXML(nota.xml, nota.noteNumber)}
                            >
                                Baixar XML
                            </Button>
                        )}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
          </Box>
          {/* Controles de Paginação */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
              flexWrap: isMobile ? "wrap" : "nowrap",
              gap: isMobile ? 2 : 0,
            }}
          >
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              variant="contained"
              color="primary"
              fullWidth={isMobile}
            >
              Anterior
            </Button>

            <Typography sx={{ textAlign: "center", flexGrow: 1 }}>
              Página {currentPage} de {totalPages || 1}
            </Typography>

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0 || loading}
              variant="contained"
              color="primary"
              fullWidth={isMobile}
            >
              Próxima
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NotasPage;