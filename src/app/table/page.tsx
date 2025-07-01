import { TableComponent } from "@/components/table";
import { mockData } from "@/services/mock-data/data";
export default function Table(){
    return (
        <div>
         <TableComponent data={mockData as any[]}/>
        </div>
    )
}