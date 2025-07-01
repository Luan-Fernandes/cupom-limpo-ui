'use client';

import { useState, useEffect } from "react";
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AG_GRID_LOCALE_PT } from '@ag-grid-community/locale';
import { ModuleRegistry, AllCommunityModule, ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './table.css'; 

ModuleRegistry.registerModules([AllCommunityModule]);

export interface DataProps {
  numero: number;
  valor: number;
  razaoSocial: string;
  empresa: string;
}

interface TableComponentProps {
  data: DataProps[];
}

export function TableComponent({ data }: TableComponentProps) {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const imagemFundo = "/imagemFundo.png";

  const columnDefs = [
    { field: 'numero', headerName: 'Número', flex: 1, minWidth: 100 },
    { field: 'valor', headerName: 'Valor', flex: 1, minWidth: 100 },
    { field: 'razaoSocial', headerName: 'Razão Social', flex: 2, minWidth: 150 },
    { field: 'empresa', headerName: 'Empresa', flex: 1, minWidth: 120 },
    {
      headerName: '',
      flex: 1,
      minWidth: 100,
      filter: false, 
      cellRenderer: (params: any) => (
        <button
          className="cursor-pointer border border-green-500 text-green-600 text-xs font-medium py-0.5 px-3 rounded-sm hover:bg-gradient-to-r hover:from-green-400 hover:to-green-500 hover:text-white transition-all duration-200"
          onClick={() => console.log('Exibir', params.data)}
          style={{
            background: 'linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))'
          }}
        >
          EXIBIR
        </button>
      )
    }
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  useEffect(() => {
    setItemsPerPage(10);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${imagemFundo})` }}
    >
      <div className="ag-theme-alpine w-full max-w-7xl rounded-xl shadow-lg p-6 bg-white/90 backdrop-blur-md">
        <div className="w-full h-[500px] overflow-auto">
          <AgGridReact
            rowData={data}
            columnDefs={columnDefs as ColDef<DataProps>[]}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={itemsPerPage}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            theme="legacy"
            suppressColumnVirtualisation={false}
            suppressRowVirtualisation={false}
            alwaysShowHorizontalScroll={true}
            enableCellTextSelection={true}
            ensureDomOrder={true}
            domLayout="autoHeight"
            localeText={{ ...AG_GRID_LOCALE_PT }}
            paginationNumberFormatter={(params) =>
              params.value.toLocaleString('pt-BR')
            }
          />
        </div>
      </div>
    </div>
  );
}
