import React, { useEffect } from "react";
import AuthComponent from "./AuthComponent";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 Not Found";
  }, []);
  return (
    <AuthComponent>
      <div class="container-fluid">
        <div class="row bg-title">
          <div class="col-lg-12">
            <h4 class="page-title">Blank</h4>
            <ol class="breadcrumb">
              <li>
                <a href="#">404</a>
              </li>
              <li class="active">404 Not Found</li>
            </ol>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="white-box">
              <h3>Blank Page</h3>
            </div>
          </div>
        </div>
      </div>
    </AuthComponent>
  );
}
