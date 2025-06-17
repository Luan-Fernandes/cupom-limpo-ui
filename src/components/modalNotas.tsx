'use client';
import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  CircularProgress,
  TextField,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export interface NotaFiscal {
  id: string;
  xml: string;
  dateEmissao: string;
  value: number;
  noteNumber: string;
  corporateReason: string;
  fantasyName: string;
  userId: string;
  chaveDeAcesso: string;
}

interface ModalNotasFiscaisProps {
  isOpen: boolean;
  onClose: () => void;
  notas: NotaFiscal[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

export function ModalNotasFiscais({
  isOpen,
  onClose,
  notas,
  currentPage,
  totalPages,
  onPageChange,
  loading,
}: ModalNotasFiscaisProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredNotas = useMemo(() => {
    return notas.filter((nota) => {
      const value = nota.value;
      const date = new Date(nota.dateEmissao);

      const min = minValue ? parseFloat(minValue) : -Infinity;
      const max = maxValue ? parseFloat(maxValue) : Infinity;
      const start = startDate ? new Date(startDate) : new Date("1900-01-01");
      const end = endDate ? new Date(endDate) : new Date("9999-12-31");

      return (
        value >= min &&
        value <= max &&
        date >= start &&
        date <= end
      );
    });
  }, [notas, minValue, maxValue, startDate, endDate]);

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

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth fullScreen={isMobile}>
      <DialogTitle sx={{ m: 0, p: 2, fontSize: isMobile ? "1.25rem" : "1.5rem" }}>
        Notas Fiscais
        <IconButton
          aria-label="fechar"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: theme.palette.grey[500] }}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          gap={2}
          mb={3}
        >
          <TextField
            label="Valor Mínimo"
            type="number"
            fullWidth
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            inputProps={{ step: "0.01" }}
          />
          <TextField
            label="Valor Máximo"
            type="number"
            fullWidth
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            inputProps={{ step: "0.01" }}
          />
          <TextField
            label="Data Inicial"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            label="Data Final"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredNotas.length === 0 ? (
          <Typography align="center" color="textSecondary" sx={{ py: 4 }}>
            Nenhuma nota encontrada.
          </Typography>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
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
                {filteredNotas.map((nota) => (
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
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownloadXML(nota.xml, nota.noteNumber)}
                      >
                        {isMobile ? "XML" : "Baixar XML"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "space-between",
          px: 3,
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        <Button
          onClick={handlePrev}
          disabled={currentPage === 1 || loading}
          variant="contained"
          color="primary"
          sx={{ mb: isMobile ? 1 : 0 }}
          fullWidth={isMobile}
        >
          Anterior
        </Button>

        <Typography sx={{ textAlign: "center", flexGrow: 1 }}>
          Página {currentPage} de {totalPages || 1}
        </Typography>

        <Button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0 || loading}
          variant="contained"
          color="primary"
          sx={{ mb: isMobile ? 1 : 0 }}
          fullWidth={isMobile}
        >
          Próxima
        </Button>
      </DialogActions>
    </Dialog>
  );
}