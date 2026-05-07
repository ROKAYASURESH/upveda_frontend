// import { useState, useEffect } from "react";
import { DateObject } from "react-multi-date-picker";
export default function Dashboard() {

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div className="d-block mb-4 mb-md-0">
                    {/* {"{"}% include 'includes/breadcrumb.html' %{"}"} */}
                    <div className="d-flex justify-content-between w-100 flex-wrap">
                        <div className="mb-3 mb-lg-0">
                            <h1 className="h4">Consistent Infosystems Pvt. Ltd.</h1>
                        </div>
                    </div>
                </div>
                <div className="btn-toolbar mb-2 mb-md-0"></div>
            </div>
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="card card-body border-0 shadow mb-4">
                    </div>
                </div>
                <div className="col-12 col-xl-4">
                </div>
            </div>
        </>
    )
}