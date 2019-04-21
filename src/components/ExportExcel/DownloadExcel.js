import React from "react";
import ReactExport from "react-data-export";
import {Button} from 'antd';


// const seconds = new Date().getTime();
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


class DownloadExcel extends React.Component {
    render() {
        const {excelData, sheetName, filename, isProductExport=true} = this.props;
        // const exportName = filename ? `${filename}_${seconds}` : `download_${seconds}`; 
        let transformData = [];
        excelData.map(data => {
            let newData = {};
            Object.keys(data).map(function(key) {
                if(key === 'ps_imgs') {
                    data.ps_imgs.map((value, i) => {
                        newData[`ps_img_${i+1}`] = value.file;
                    });
                } else if (key === 'variation_product') {
                    data.ps_imgs.map((value, i) => {
                        newData[`variation_product_${i+1}_name`] = value.ps_variation_name;
                        newData[`variation_product_${i+1}_price`] = value.ps_variation_price;
                        newData[`variation_product_${i+1}_stock`] = value.ps_variation_stock;
                    });
                } else newData[key] = data[key];
              });
            transformData.push(newData);
        });
        
        return (isProductExport ? 
            (<ExcelFile  filename={filename} element={<Button type='primary' icon="download" >Xuất file excel</Button>}>
                <ExcelSheet data={transformData} name={sheetName}>
                    <ExcelColumn label="Category" value="ps_category_list_id"/>
                    <ExcelColumn label="Tên mẫu" value="ps_product_name"/>
                    <ExcelColumn label="Mô tả mẫu"  value="ps_product_description"/>
                    <ExcelColumn label="Giá"  value="ps_price"/>
                    <ExcelColumn label="Tồn kho"  value="ps_stock"/>
                    <ExcelColumn label="Khối lượng(g)"  value="ps_product_weight"/>
                    <ExcelColumn label="Thời gian ship"  value="ps_days_to_ship"/>
                    <ExcelColumn label="Channel_50012_switch"  value="channel_50012_switch"/>
                    <ExcelColumn label="Channel_50011_switch"  value="channel_50011_switch"/>
                    <ExcelColumn label="Channel_50016_switch"  value="channel_50016_switch"/>
                    <ExcelColumn label="Channel_50015_switch"  value="channel_50015_switch"/>
                    <ExcelColumn label="Channel_50010_switch"  value="channel_50010_switch"/>
                    <ExcelColumn label="Product Variation 1 - Product Variation Name"  value="variation_product_1_name"/>
                    <ExcelColumn label="Product Variation 1 - Product Variation Price"  value="variation_product_1_price"/>
                    <ExcelColumn label="Product Variation 1 - Product Variation Stock"  value="variation_product_1_stock"/>
                    <ExcelColumn label="Product Variation 2 - Product Variation Name"  value="variation_product_2_name"/>
                    <ExcelColumn label="Product Variation 2 - Product Variation Price"  value="variation_product_2_price"/>
                    <ExcelColumn label="Product Variation 2 - Product Variation Stock"  value="variation_product_2_stock"/>         
                    <ExcelColumn label="Ảnh 1" value="ps_img_1" />
                    <ExcelColumn label="Ảnh 2" value="ps_img_2" />
                    <ExcelColumn label="Ảnh 3" value="ps_img_3" />
                    <ExcelColumn label="Ảnh 4" value="ps_img_4" />
                    <ExcelColumn label="Ảnh 5" value="ps_img_5" />
                    <ExcelColumn label="Ảnh 6" value="ps_img_6" />
                    <ExcelColumn label="Ảnh 7" value="ps_img_7" />
                    <ExcelColumn label="Ảnh 8" value="ps_img_8" />
                    <ExcelColumn label="Ảnh 9" value="ps_img_9" />
                </ExcelSheet>
            </ExcelFile>)
            : 
            (<ExcelFile  filename={filename} element={<Button type='primary' icon="download" >Xuất file excel</Button>}>
            <ExcelSheet data={transformData} name={sheetName}>
                <ExcelColumn label="ID" value="id"/>
                <ExcelColumn label="Category" value="ps_category_list_id"/>
                <ExcelColumn label="Tên mẫu" value="ps_product_name"/>
                <ExcelColumn label="Mô tả mẫu"  value="ps_product_description"/>
                <ExcelColumn label="Giá"  value="ps_price"/>
                <ExcelColumn label="Tồn kho"  value="ps_stock"/>
                <ExcelColumn label="Khối lượng(g)"  value="ps_product_weight"/>
                <ExcelColumn label="Thời gian ship"  value="ps_days_to_ship"/>
                <ExcelColumn label="Channel_50012_switch"  value="channel_50012_switch"/>
                <ExcelColumn label="Channel_50011_switch"  value="channel_50011_switch"/>
                <ExcelColumn label="Channel_50016_switch"  value="channel_50016_switch"/>
                <ExcelColumn label="Channel_50015_switch"  value="channel_50015_switch"/>
                <ExcelColumn label="Channel_50010_switch"  value="channel_50010_switch"/>   
                <ExcelColumn label="Ảnh 1" value="ps_img_1" />
                <ExcelColumn label="Ảnh 2" value="ps_img_2" />
                <ExcelColumn label="Ảnh 3" value="ps_img_3" />
                <ExcelColumn label="Ảnh 4" value="ps_img_4" />
                <ExcelColumn label="Ảnh 5" value="ps_img_5" />
            </ExcelSheet>
        </ExcelFile>)
        );
    }
}
export default DownloadExcel;