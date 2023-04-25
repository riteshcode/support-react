import React, { useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Preloader from "./component/Preloader";

import POST from "axios/post";
import { languageDetailsUrl } from "config/index";
import { updateLangState } from "redux/slice/loginSlice";
import Pusher from "pusher-js";

import "./App.css";
const Layouts = lazy(() => import("./layouts"));
const SuperAdmin = lazy(() => import("layouts/SuperAdmin"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Roles = lazy(() => import("./pages/role"));
const Departments = lazy(() => import("./pages/departments"));
const Designation = lazy(() => import("./pages/designation"));
const Login = lazy(() => import("./pages/login"));
const ForgetPassword = lazy(() => import("./pages/forgetPassword"));
// const User = lazy(() => import("./pages/user"));
const Category = lazy(() => import("./pages/category"));
const Product = lazy(() => import("./pages/product"));
const Setting = lazy(() => import("./pages/setting"));
const UserEdit = lazy(() => import("./pages/user/UserEdit"));
const Module = lazy(() => import("./pages/module/index"));

const PageNotFound = lazy(() => import("./pages/error/pageNotFound"));
const Demo = lazy(() => import("./pages/demo/index"));
const LeaveApplication = lazy(() => import("./pages/leave"));
const Attendance = lazy(() => import("./pages/attendance"));

// superadmins
const SuperDashboard = lazy(() => import("pages/superadmin/dashboard"));
const SuperLogin = lazy(() => import("pages/superadmin/login"));
const SuperUser = lazy(() => import("pages/superadmin/user"));

const SuperForgetPassword = lazy(() =>
  import("pages/superadmin/forgetPassword")
);
// const SuperRoles = lazy(() => import("pages/superadmin/role"));
const SuperSetting = lazy(() => import("pages/superadmin/setting"));
const SuperUserEdit = lazy(() => import("pages/superadmin/user/UserEdit"));
const Plan = lazy(() => import("pages/superadmin/plan/index"));
const Subscription = lazy(() => import("pages/superadmin/subscription/index"));
const ViewSubscription = lazy(() =>
  import("pages/superadmin/subscription/view")
);
const Subscriber = lazy(() => import("pages/superadmin/subscriber/index"));
const ViewSubscriber = lazy(() => import("pages/superadmin/subscriber/view"));
const Language = lazy(() => import("pages/superadmin/language"));
const Country = lazy(() => import("pages/superadmin/country"));
const Currency = lazy(() => import("pages/superadmin/currency"));
const Industry = lazy(() => import("pages/superadmin/industry"));
const TranslationView = lazy(() => import("pages/superadmin/translation"));
const Staff = lazy(() => import("pages/staff/index"));
const StaffView = lazy(() => import("pages/staff/View"));

//global
const PageAccessCheck = lazy(() => import("pages/PageAccessCheck"));
const PaymentPage = lazy(() => import("pages/PaymentPage"));
const PaymentMethod = lazy(() => import("pages/superadmin/paymentMethod"));

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, language, language_list } = useSelector(
    (state) => state.login
  );

  useEffect(() => {
    let abortController = new AbortController();

    async function getLang() {
      await POST(languageDetailsUrl, {
        language: language,
        lang_key: "website",
      })
        .then((response) => {
          console.log("lang working");
          const dataVal = response.data.data.lang_value;
          const formData = {
            lang: language,
            langDetails: dataVal,
          };
          dispatch(updateLangState(formData));
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }

    function loadItem() {
      const languageL = language_list;
      if (languageL === null) getLang();

      // Enable pusher logging - don't include this in production
      // Pusher.logToConsole = true;
      var pusher = new Pusher("f6c1658ca74033b5b6cf", {
        cluster: "ap2",
      });
      var channel = pusher.subscribe("global-between-superadmin-admin-channel");
      channel.bind("global-between-superadmin-admin-event", function (data) {
        alert(JSON.stringify(data));
      });
    }
    loadItem();
    return () => {
      // loadItem();
      abortController.abort();
    };
  }, [dispatch, language, language_list]);

  return (
    <Router>
      <Suspense fallback={<Preloader />}>
        <Routes>
          <Route
            path="/subscription/payment/:paymentId"
            element={<PaymentPage />}
          />
          <Route path="/" element={<AdminLayout />}>
            <Route
              index
              element={<PageAccessCheck component={<Dashboard />} />}
            />
            <Route
              exact
              path="/role"
              element={<PageAccessCheck component={<Roles />} />}
            />
            <Route
              exact
              path="/department"
              element={<PageAccessCheck component={<Departments />} />}
            />
            <Route
              exact
              path="/designation"
              element={<PageAccessCheck component={<Designation />} />}
            />
            <Route
              exact
              path="/user"
              element={<PageAccessCheck component={<SuperUser />} />}
            />
            <Route
              exact
              path="/staff"
              element={<PageAccessCheck component={<Staff />} />}
            />
            <Route
              exact
              path="/staff/view/:staffId"
              element={<PageAccessCheck component={<StaffView />} />}
            />

            <Route
              exact
              path="/leave"
              element={<PageAccessCheck component={<LeaveApplication />} />}
            />
            <Route
              exact
              path="/attendance"
              element={<PageAccessCheck component={<Attendance />} />}
            />

            <Route
              exact
              path="/manage/category"
              element={<PageAccessCheck component={<Category />} />}
            />

            <Route
              exact
              path="/manage/product"
              element={<PageAccessCheck component={<Product />} />}
            />
            <Route exact path="/demo" element={<Demo />} />
            <Route
              exact
              path="/user/edit/:userId"
              element={<PageAccessCheck component={<UserEdit />} />}
            />
            <Route
              exact
              path="/login"
              element={isAuthenticated ? <Navigate to="/" /> : <Login />}
            />
            <Route
              exact
              path="/forget-password"
              element={
                isAuthenticated ? <Navigate to="/" /> : <ForgetPassword />
              }
            />
            <Route
              exact
              path="/setting"
              element={<PageAccessCheck component={<Setting />} />}
            />
            <Route
              exact
              path="/setting/:pagetype"
              element={<PageAccessCheck component={<Setting />} />}
            />

            {/* superadmin all route store here */}

            <Route path="superadmin" element={<SuperAdminLayout />}>
              <Route
                exact
                path="leave"
                element={<PageAccessCheck component={<LeaveApplication />} />}
              />
              <Route
                exact
                path="attendance"
                element={<PageAccessCheck component={<Attendance />} />}
              />
              <Route
                index
                element={<PageAccessCheck component={<SuperDashboard />} />}
              />
              <Route
                exact
                path="login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/superadmin/" />
                  ) : (
                    <SuperLogin />
                  )
                }
              />
              <Route
                exact
                path="forget-password"
                element={
                  isAuthenticated ? (
                    <Navigate to="/" />
                  ) : (
                    <SuperForgetPassword />
                  )
                }
              />
              <Route
                exact
                path="subscription"
                element={<PageAccessCheck component={<Subscription />} />}
              />
              <Route
                exact
                path="payment_method"
                element={<PageAccessCheck component={<PaymentMethod />} />}
              />

              <Route
                exact
                path="subscription/:business_id"
                element={<PageAccessCheck component={<Subscription />} />}
              />
              <Route
                exact
                path="subscription/view/:subcription_id"
                element={<PageAccessCheck component={<ViewSubscription />} />}
              />
              <Route
                exact
                path="plan"
                element={<PageAccessCheck component={<Plan />} />}
              />
              <Route
                exact
                path="language"
                element={<PageAccessCheck component={<Language />} />}
              />
              <Route
                exact
                path="translation"
                element={<PageAccessCheck component={<TranslationView />} />}
              />
              <Route
                exact
                path="country"
                element={<PageAccessCheck component={<Country />} />}
              />
              <Route
                exact
                path="industry"
                element={<PageAccessCheck component={<Industry />} />}
              />
              <Route
                exact
                path="module"
                element={<PageAccessCheck component={<Module />} />}
              />
              <Route
                exact
                path="currency"
                element={<PageAccessCheck component={<Currency />} />}
              />
              <Route
                exact
                path="subscriber"
                element={<PageAccessCheck component={<Subscriber />} />}
              />
              <Route
                exact
                path="subscriber/view/:subscriber_id"
                element={<PageAccessCheck component={<ViewSubscriber />} />}
              />
              <Route
                exact
                path="role"
                element={<PageAccessCheck component={<Roles />} />}
              />
              <Route
                exact
                path="user"
                element={<PageAccessCheck component={<SuperUser />} />}
              />
              <Route
                exact
                path="department"
                element={<PageAccessCheck component={<Departments />} />}
              />
              <Route
                exact
                path="designation"
                element={<PageAccessCheck component={<Designation />} />}
              />
              <Route
                exact
                path="manage/category"
                element={<PageAccessCheck component={<Category />} />}
              />
              <Route
                exact
                path="manage/product"
                element={<PageAccessCheck component={<Product />} />}
              />
              <Route
                exact
                path="user/edit/:userId"
                element={
                  isAuthenticated ? (
                    <SuperUserEdit />
                  ) : (
                    <Navigate to="/superadmin/login" />
                  )
                }
              />
              <Route
                exact
                path="setting/:pageCall/:pagetype"
                element={<PageAccessCheck component={<SuperSetting />} />}
              />
              <Route path="*" element={<PageNotFound />} />
            </Route>

            {/* end super admin all route */}

            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

function AdminLayout() {
  return (
    <Layouts>
      <Outlet />
    </Layouts>
  );
}
function SuperAdminLayout() {
  return (
    <SuperAdmin>
      <Outlet />
    </SuperAdmin>
  );
}

export default App;
