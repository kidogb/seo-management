import React from "react";
import ReactExport from "react-data-export";
import {Button} from 'antd';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


class DownloadExcel extends React.Component {

    
    render() {
        const {excelData, sheetName} = this.props;
        return (
            <ExcelFile element={<Button type='primary' icon="download">Xuất file excel</Button>}>
                <ExcelSheet data={excelData} name={sheetName}>
                    <ExcelColumn label="ID" value="id"/>
                    <ExcelColumn label="Tên mẫu" value="ps_product_name"/>
                    <ExcelColumn label="Category" value="ps_category_list_id"/>
                    <ExcelColumn label="Tồn kho"  value="ps_stock"/>
                    <ExcelColumn label="Mô tả mẫu"  value="ps_product_description"/>
                    <ExcelColumn label="Khối lượng(g)"  value="ps_product_weight"/>
                    <ExcelColumn label="Giá"  value="ps_price"/>
                    {/* <ExcelColumn label="Ảnh"  value={data => data.ps_imgs.map(ps_img => ps_img.url
                    )}/> */}
                </ExcelSheet>
            </ExcelFile>
        );
    }
}
export default DownloadExcel;