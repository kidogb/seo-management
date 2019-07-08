import React from "react";
import ReactExport from "react-data-export";
import { Button } from 'antd';
import { MAX_FILE_UPLOAD_PRODUCT, MAX_FILE_UPLOAD_SAMPLE } from "@/common/constant";


// const seconds = new Date().getTime();
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


class DownloadExcel extends React.Component {

    generateVariationProductColumn = (maxNumberVariation) => {
        let variation_column = [];
        for (let i = 1; i <= maxNumberVariation; i++) {
            variation_column.push(
                <ExcelColumn key={`variation_product_${i}_name`} label={`ps_variation ${i} ps_variation_name`} value={`variation_product_${i}_name`} />,
                <ExcelColumn key={`variation_product_${i}_price`} label={`ps_variation ${i} ps_variation_price`} value={`variation_product_${i}_price`} />,
                <ExcelColumn key={`variation_product_${i}_stock`} label={`ps_variation ${i} ps_variation_stock`} value={`variation_product_${i}_stock`} />
            );
        }
        return variation_column;
    }

    generateVariationSampleColumn = (maxNumberVariation) => {
        let variation_column = [];
        for (let i = 1; i <= maxNumberVariation; i++) {
            variation_column.push(
                <ExcelColumn key={`variation_sample_${i}_name`} label={`ps_variation ${i} ps_variation_name`} value={`variation_sample_${i}_name`} />,
                <ExcelColumn key={`variation_sample_${i}_price`} label={`ps_variation ${i} ps_variation_price`} value={`variation_sample_${i}_price`} />,
                <ExcelColumn key={`variation_sample_${i}_stock`} label={`ps_variation ${i} ps_variation_stock`} value={`variation_sample_${i}_stock`} />
            );
        }
        return variation_column;
    }

    generateImageColumn = (maxColumn) => {
        let ps_imgs_column = [];
        for (let i = 1; i <= maxColumn; i++) {
            ps_imgs_column.push(
                <ExcelColumn key={`ps_img_${i}`} label={`ps_img_${i}`} value={`ps_img_${i}`} />,
            );
        }
        return ps_imgs_column;
    }

    render() {
        const { excelData, sheetName, filename, isProductExport = true } = this.props;
        let transformData = [];
        let maxNumberVariation = 0;
        excelData.map(data => {
            let newData = {};
            const profile_image_id = data.profile_image_id;
            const cover_img = profile_image_id ? data.ps_imgs.find(img => img.id === profile_image_id) : null;
            Object.keys(data).map(function (key) {
                if (key === 'ps_imgs') {
                    if (cover_img) {
                        newData[`ps_img_1`] = cover_img.file;
                        const ps_imgs_without_cover = data.ps_imgs.filter(img => img.id !== cover_img.id);
                        ps_imgs_without_cover.map((value, i) => {
                            newData[`ps_img_${i + 2}`] = value.file;
                        });
                    } else {
                        data.ps_imgs.map((value, i) => {
                            newData[`ps_img_${i + 1}`] = value.file;
                        });
                    }

                } else if (key === 'variation_product') {
                    if (data.variation_product.length >= maxNumberVariation) maxNumberVariation = data.variation_product.length;
                    data.variation_product.map((value, i) => {
                        newData[`${key}_${i + 1}_name`] = value.ps_variation_name;
                        newData[`${key}_${i + 1}_price`] = value.ps_variation_price;
                        newData[`${key}_${i + 1}_stock`] = value.ps_variation_stock;
                    });
                } else if (key === 'variation_sample') {
                    if (data.variation_sample.length >= maxNumberVariation) maxNumberVariation = data.variation_sample.length;
                    data.variation_sample.map((value, i) => {
                        newData[`${key}_${i + 1}_name`] = value.ps_variation_name;
                        newData[`${key}_${i + 1}_price`] = value.ps_variation_price;
                        newData[`${key}_${i + 1}_stock`] = value.ps_variation_stock;
                    });
                }
                else newData[key] = data[key];
            });
            transformData.push(newData);
        });

        return (isProductExport ?
            (<ExcelFile filename={filename} element={<Button type='primary' icon="download" >Xuất file excel</Button>}>
                <ExcelSheet data={transformData} name={sheetName}>
                    <ExcelColumn label="ps_category_list_id" value="ps_category_list_id" />
                    <ExcelColumn label="ps_product_name" value="ps_product_name" />
                    <ExcelColumn label="ps_product_description" value="ps_product_description" />
                    <ExcelColumn label="ps_price" value="ps_price" />
                    <ExcelColumn label="ps_stock" value="ps_stock" />
                    <ExcelColumn label="ps_product_weight" value="ps_product_weight" />
                    <ExcelColumn label="ps_days_to_ship" value="ps_days_to_ship" />
                    <ExcelColumn label="Channel_50012_switch" value="channel_50012_switch" />
                    <ExcelColumn label="Channel_50011_switch" value="channel_50011_switch" />
                    <ExcelColumn label="Channel_50016_switch" value="channel_50016_switch" />
                    <ExcelColumn label="Channel_50015_switch" value="channel_50015_switch" />
                    <ExcelColumn label="Channel_50010_switch" value="channel_50010_switch" />
                    {this.generateVariationProductColumn(maxNumberVariation)}
                    {this.generateImageColumn(MAX_FILE_UPLOAD_PRODUCT)}
                </ExcelSheet>
            </ExcelFile>)
            :
            (<ExcelFile filename={filename} element={<Button type='primary' icon="download" >Xuất file excel</Button>}>
                <ExcelSheet data={transformData} name={sheetName}>
                    <ExcelColumn label="ps_category_list_id" value="ps_category_list_id" />
                    <ExcelColumn label="ps_product_name" value="ps_product_name" />
                    <ExcelColumn label="ps_product_description" value="ps_product_description" />
                    <ExcelColumn label="ps_price" value="ps_price" />
                    <ExcelColumn label="ps_stock" value="ps_stock" />
                    <ExcelColumn label="ps_product_weight" value="ps_product_weight" />
                    <ExcelColumn label="ps_days_to_ship" value="ps_days_to_ship" />
                    <ExcelColumn label="Channel_50012_switch" value="channel_50012_switch" />
                    <ExcelColumn label="Channel_50011_switch" value="channel_50011_switch" />
                    <ExcelColumn label="Channel_50016_switch" value="channel_50016_switch" />
                    <ExcelColumn label="Channel_50015_switch" value="channel_50015_switch" />
                    <ExcelColumn label="Channel_50010_switch" value="channel_50010_switch" />
                    {this.generateVariationSampleColumn(maxNumberVariation)}
                    {this.generateImageColumn(MAX_FILE_UPLOAD_SAMPLE)}
                </ExcelSheet>
            </ExcelFile>)
        );
    }
}
export default DownloadExcel;