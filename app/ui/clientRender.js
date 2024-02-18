'use client'
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { flsModules } from "../js/files/modules.js";
import SelectConstructor from "../js/libs/select.js"
const ClientSideComponent = dynamic(() => {
    return new Promise((resolve) => {
        resolve((props) => {
            useEffect(() => {

                flsModules.select = new SelectConstructor({});
            }, []);
            return props.component;
        }
        );
    });

}, { ssr: false });

export default ClientSideComponent;