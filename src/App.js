import "babel-polyfill";

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
import { SuperGeneralSettingUrl } from "config/index";
import {
  updateLangState,
  updateSuperSettingState,
  upNotiMsgCount,
} from "redux/slice/loginSlice";
import Pusher from "pusher-js";

import "./App.css";
import Notify from "component/Notify";
import PushNotify from "component/PushNotify";

const Layouts = lazy(() => import("layouts"));
const SuperAdmin = lazy(() => import("layouts/SuperAdmin"));

const Dashboard = lazy(() => import("pages/dashboard"));
const Roles = lazy(() => import("pages/role"));
const Login = lazy(() => import("pages/login"));
const ForgetPassword = lazy(() => import("pages/forgetPassword"));

const BlogPost = lazy(() => import("pages/setting/blogPostSetting/index"));
const AddBlogPost = lazy(() => import("pages/setting/blogPostSetting/create"));
const EditBlogPost = lazy(() => import("pages/setting/blogPostSetting/edit"));

//shipping
const ShippingMethod = lazy(() => import("pages/superadmin/shippingMethod"));

const ShippingSetting = lazy(() =>
  import("pages/setting/shippingSetting/ShippingSetting")
);

const Ticket = lazy(() => import("pages/support/ticket/index"));

const WebFunction = lazy(() =>
  import("pages/setting/webFunctionSetting/index")
);

const FeaturedGroup = lazy(() =>
  import("pages/ecommerce/featureGroupProduct/FeatureGroup")
);

// const User = lazy(() => import("./pages/user"));
const Category = lazy(() => import("pages/ecommerce/category/index"));
const Supplier = lazy(() => import("pages/ecommerce/supplier"));

const Lead = lazy(() => import("pages/crm/lead"));
const Customers = lazy(() => import("pages/crm/customer"));
const Quotation = lazy(() => import("pages/crm/quotation"));
const QuotationCreate = lazy(() => import("pages/crm/quotation/Create"));
const QuotationDetail = lazy(() => import("pages/crm/quotation/Detail"));
const QuotationEdit = lazy(() => import("pages/crm/quotation/Edit"));

const QuotationShareDetail = lazy(() =>
  import("pages/crm/quotation/ShareDetail")
);

const LeadSource = lazy(() =>
  import("pages/crm/lead_setting/lead_source/index")
);
const LeadIndustry = lazy(() =>
  import("pages/crm/lead_setting/lead_industry/index")
);
const LeadStatus = lazy(() =>
  import("pages/crm/lead_setting/lead_status/index")
);

const TaxSetting = lazy(() =>
  import("pages/crm/lead_setting/tax_setting/index")
);

const TaxGroupSetting = lazy(() =>
  import("pages/crm/lead_setting/tax_group_setting/index")
);

const PaymentTermSetting = lazy(() =>
  import("pages/crm/lead_setting/payment_term_setting/index")
);

const Brand = lazy(() => import("pages/ecommerce/brand"));

const Product = lazy(() => import("pages/ecommerce/product"));
const ProductCreate = lazy(() => import("pages/ecommerce/product/Create"));
const ProductEdit = lazy(() => import("pages/ecommerce/product/Edit"));
const ProductShow = lazy(() => import("pages/ecommerce/product/Detail"));
const ProductOptions = lazy(() =>
  import("pages/ecommerce/productOptions/index")
);

const Setting = lazy(() => import("pages/setting"));
const UserEdit = lazy(() => import("pages/user/UserEdit"));
const Module = lazy(() => import("pages/module/index"));
const ProductType = lazy(() => import("pages/superadmin/productType/index"));

// template
const Template = lazy(() => import("pages/superadmin/template"));
const TemplateComponent = lazy(() =>
  import("pages/superadmin/templateComponent/Index")
);

const WebTestimonial = lazy(() =>
  import("pages/setting/TestimonialSetting/index")
);
const WebFeature = lazy(() => import("pages/ecommerce/webFeature/index"));

// website setting
const WebSetting = lazy(() => import("pages/setting/websetting/WebSetting"));

// theme setting
const Theme = lazy(() => import("pages/setting/templateSetting/Theme"));
const ThemeDetail = lazy(() =>
  import("pages/setting/templateSetting/ThemeDetail")
);
const ThemeComponentDetail = lazy(() =>
  import("pages/setting/templateSetting/ThemeComponent")
);

// / app setting
const AppSetting = lazy(() => import("pages/setting/appSetting/AppSetting"));
//payment setting
const PaymentSetting = lazy(() =>
  import("pages/setting/paymentSetting/PaymentSetting")
);

// pages setting
const PagesSetting = lazy(() => import("pages/setting/pageSetting/index"));
const AddPagesSetting = lazy(() => import("pages/setting/pageSetting/Create"));
const EditPagesSetting = lazy(() => import("pages/setting/pageSetting/Edit"));

const BannerGroup = lazy(() =>
  import("pages/setting/bannerSetting/BannerGroup")
);
const Banner = lazy(() => import("pages/setting/bannerSetting/Banner"));

// menu group
const MenuGroup = lazy(() => import("pages/setting/menuSetting/MenuGroup"));
const Menu = lazy(() => import("pages/setting/menuSetting/Menu"));

//EmailGroup
const EmailGroup = lazy(() => import("pages/setting/emailSetting/EmailGroup"));
const EmailTemplate = lazy(() =>
  import("pages/setting/emailSetting/EmailTemplate")
);

const PageNotFound = lazy(() => import("pages/error/pageNotFound"));
const Demo = lazy(() => import("pages/demo/index"));

const LeaveApplication = lazy(() => import("pages/hrm/leave"));
const Attendance = lazy(() => import("pages/hrm/attendance"));
const Staff = lazy(() => import("pages/hrm/staff/index"));
const StaffView = lazy(() => import("pages/hrm/staff/View"));
const Departments = lazy(() => import("pages/hrm/departments"));
const Designation = lazy(() => import("pages/hrm/designation"));
const Newsletter = lazy(() => import("pages/marketing/newsletter/index"));
const Enquiry = lazy(() => import("pages/crm/enquiry/index"));

//sales
const Orders = lazy(() => import("pages/sales/orders/index"));
const OrderDetails = lazy(() => import("pages/sales/orders/Detail"));
const Reviews = lazy(() => import("pages/ecommerce/reviews/index"));

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

//global
const PageAccessCheck = lazy(() => import("pages/PageAccessCheck"));
const PaymentPage = lazy(() => import("pages/PaymentPage"));
const PaymentMethod = lazy(() => import("pages/superadmin/paymentMethod"));

const SettingGroupList = lazy(() =>
  import("pages/superadmin/settingGroup/index")
);
const EditSettingGroup = lazy(() =>
  import("pages/superadmin/settingGroup/SettingGroup")
);

const WebSettingGroup = lazy(() =>
  import("pages/superadmin/WebSettingGroup/index")
);
const EditWebSettingGroup = lazy(() =>
  import("pages/superadmin/WebSettingGroup/SettingGroup")
);
const NotificationSetting = lazy(() =>
  import("pages/setting/notificationSetting/index")
);

const Listing = lazy(() => import("pages/listing/category/index"));
const IndustryCategory = lazy(() =>
  import("pages/superadmin/industry/Category")
);

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, userInfo, notiCount, language, language_list } =
    useSelector((state) => state.login);

  useEffect(() => {
    let abortController = new AbortController();

    // Enable pusher logging - don't include this in production
    // Pusher.logToConsole = true;
    var pusher = new Pusher("f6c1658ca74033b5b6cf", {
      cluster: "ap2",
    });

    async function getLang() {
      await POST(SuperGeneralSettingUrl, {
        language: language,
        lang_key: "backend",
      })
        .then((response) => {
          console.log(response);
          const dataVal = response.data.data.language_data.lang_value;
          const setting_data = response.data.data.setting_data;
          const formData = {
            lang: language,
            langDetails: dataVal,
          };
          dispatch(updateLangState(formData));
          dispatch(updateSuperSettingState(setting_data));
        })
        .catch((error) => {
          Notify(false, error.message);
        });
    }

    function enablePrivatePusher() {
      let userDetails = "";
      userDetails = JSON.parse(userInfo);

      let db_user_id = `${userDetails.dump}-${userDetails.id}`;

      var prChannel = pusher.subscribe(`pr-channel-${db_user_id}`);
      prChannel.bind("pr-channel-admin", function (data) {
        console.log("pusher data", data);

        // increase count by 1 each private notification
        const ev = {
          count: parseInt(notiCount) + 1,
          type: "noti",
        };
        dispatch(upNotiMsgCount(ev)); // update noticount state

        if (typeof data === "object" && data !== null) {
          const res = JSON.parse(data.KEY);
          if (res !== undefined) PushNotify(res?.n_message);
        } else {
          PushNotify(data);
        }
      });
    }

    function loadItem() {
      const languageL = language_list;
      if (languageL === null) getLang();

      // global channel
      var channel = pusher.subscribe("global-between-superadmin-admin-channel");
      channel.bind("global-between-superadmin-admin-event", function (data) {
        const { msg } = data;
        Notify(true, msg);
      });
    }
    loadItem();

    // private channel log
    if (isAuthenticated) enablePrivatePusher();

    return () => {
      // loadItem();
      abortController.abort();
    };
  }, [dispatch, language, language_list, isAuthenticated]);

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
              path="/themes"
              element={<PageAccessCheck component={<Theme />} />}
            />
            <Route
              exact
              path="/themes/component/:themeId"
              element={<PageAccessCheck component={<ThemeComponentDetail />} />}
            />
            <Route
              exact
              path="/themes/design/:themeId"
              element={<PageAccessCheck component={<ThemeDetail />} />}
            />
            <Route
              exact
              path="/feature"
              element={<PageAccessCheck component={<WebFeature />} />}
            />
            <Route
              exact
              path="/testimonial"
              element={<PageAccessCheck component={<WebTestimonial />} />}
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
              path="/function-settings"
              element={<PageAccessCheck component={<WebFunction />} />}
            />
            <Route
              exact
              path="/blog-setting"
              element={<PageAccessCheck component={<BlogPost />} />}
            />
            <Route
              exact
              path="/blog-setting/add"
              element={<PageAccessCheck component={<AddBlogPost />} />}
            />
            <Route
              exact
              path="/blog-setting/edit/:postId"
              element={<PageAccessCheck component={<EditBlogPost />} />}
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
            {/* commerce */}
            <Route
              exact
              path="/categories"
              element={<PageAccessCheck component={<Category />} />}
            />
            <Route
              exact
              path="/categories/:catId"
              element={<PageAccessCheck component={<Category />} />}
            />
            <Route
              exact
              path="/supplier"
              element={<PageAccessCheck component={<Supplier />} />}
            />
            <Route
              exact
              path="/lead"
              element={<PageAccessCheck component={<Lead />} />}
            />
            <Route
              exact
              path="/customers"
              element={<PageAccessCheck component={<Customers />} />}
            />
            // quote share without
            <Route
              exact
              path="/quotation/shareQuote"
              element={<QuotationShareDetail />}
            />
            <Route
              exact
              path="/quotation"
              element={<PageAccessCheck component={<Quotation />} />}
            />
            <Route
              exact
              path="/quotation/create"
              element={<PageAccessCheck component={<QuotationCreate />} />}
            />
            <Route
              exact
              path="/email-settings"
              element={<PageAccessCheck component={<EmailGroup />} />}
            />
            <Route
              exact
              path="/email-settings/:menuGroupId"
              element={<PageAccessCheck component={<EmailTemplate />} />}
            />
            <Route
              exact
              path="/quotation/edit/:quoteId"
              element={<PageAccessCheck component={<QuotationEdit />} />}
            />
            <Route
              exact
              path="/quotation/show/:quoteId"
              element={<PageAccessCheck component={<QuotationDetail />} />}
            />
            <Route
              exact
              path="/lead-setting/source"
              element={<PageAccessCheck component={<LeadSource />} />}
            />
            <Route
              exact
              path="/lead-setting/industry"
              element={<PageAccessCheck component={<LeadIndustry />} />}
            />
            <Route
              exact
              path="/lead-setting/status"
              element={<PageAccessCheck component={<LeadStatus />} />}
            />
            <Route
              exact
              path="/tax-setting"
              element={<PageAccessCheck component={<TaxSetting />} />}
            />
            <Route
              exact
              path="/payment-term"
              element={<PageAccessCheck component={<PaymentTermSetting />} />}
            />
            <Route
              exact
              path="/tax-setting/group"
              element={<PageAccessCheck component={<TaxGroupSetting />} />}
            />
            <Route
              exact
              path="/brand"
              element={<PageAccessCheck component={<Brand />} />}
            />
            <Route
              exact
              path="/newsletter"
              element={<PageAccessCheck component={<Newsletter />} />}
            />
            <Route
              exact
              path="/app-settings"
              element={<PageAccessCheck component={<AppSetting />} />}
            />
            <Route
              exact
              path="/payment-setting"
              element={<PageAccessCheck component={<PaymentSetting />} />}
            />
            <Route
              exact
              path="/web-setting"
              element={<PageAccessCheck component={<WebSetting />} />}
            />
            <Route
              exact
              path="/pages-setting"
              element={<PageAccessCheck component={<PagesSetting />} />}
            />
            <Route
              exact
              path="/pages-setting/add"
              element={<PageAccessCheck component={<AddPagesSetting />} />}
            />
            <Route
              exact
              path="/pages-setting/edit/:pageId"
              element={<PageAccessCheck component={<EditPagesSetting />} />}
            />
            <Route
              exact
              path="/banner-setting"
              element={<PageAccessCheck component={<BannerGroup />} />}
            />
            <Route
              exact
              path="/feature-product"
              element={<PageAccessCheck component={<FeaturedGroup />} />}
            />
            <Route
              exact
              path="/banner-setting/:bannerGroupId"
              element={<PageAccessCheck component={<Banner />} />}
            />
            <Route
              exact
              path="/menu-setting"
              element={<PageAccessCheck component={<MenuGroup />} />}
            />
            <Route
              exact
              path="/menu-setting/:menuGroupId"
              element={<PageAccessCheck component={<Menu />} />}
            />
            <Route
              exact
              path="/products"
              element={<PageAccessCheck component={<Product />} />}
            />
            <Route
              exact
              path="/product-options"
              element={<PageAccessCheck component={<ProductOptions />} />}
            />
            <Route
              exact
              path="/orders"
              element={<PageAccessCheck component={<Orders />} />}
            />
            <Route
              exact
              path="/category"
              element={<PageAccessCheck component={<Listing />} />}
            />
            <Route
              exact
              path="/category/:catId"
              element={<PageAccessCheck component={<Listing />} />}
            />
            <Route
              exact
              path="/reviews"
              element={<PageAccessCheck component={<Reviews />} />}
            />
            <Route
              exact
              path="/ticket"
              element={<PageAccessCheck component={<Ticket />} />}
            />
            <Route
              exact
              path="/enquiry"
              element={<PageAccessCheck component={<Enquiry />} />}
            />
            <Route
              exact
              path="/order/:orderNumber"
              element={<PageAccessCheck component={<OrderDetails />} />}
            />
            {/* ProductAdd */}
            <Route
              exact
              path="/products/create"
              element={<PageAccessCheck component={<ProductCreate />} />}
            />
            <Route
              exact
              path="/products/edit/:proId"
              element={<PageAccessCheck component={<ProductEdit />} />}
            />
            <Route
              exact
              path="/shipping-setting"
              element={<PageAccessCheck component={<ShippingSetting />} />}
            />
            <Route
              exact
              path="/notificationSetting"
              element={<PageAccessCheck component={<NotificationSetting />} />}
            />
            <Route
              exact
              path="/products/show/:proId"
              element={<PageAccessCheck component={<ProductShow />} />}
            />
            <Route exact path="/demo" element={<Demo />} />
            <Route
              exact
              path="/user/edit/:userId"
              element={<PageAccessCheck component={<SuperUserEdit />} />}
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
            {/* <Route
              exact
              path="/setting/:pagetype"
              element={<PageAccessCheck component={<Setting />} />}
            /> */}
            {/* superadmin all route store here */}
            <Route path="superadmin" element={<SuperAdminLayout />}>
              <Route
                exact
                path="leave"
                element={<PageAccessCheck component={<LeaveApplication />} />}
              />

              <Route
                exact
                path="payment-setting"
                element={<PageAccessCheck component={<PaymentSetting />} />}
              />

              <Route
                exact
                path="email-settings"
                element={<PageAccessCheck component={<EmailGroup />} />}
              />
              <Route
                exact
                path="industry/view/:industryId"
                element={<PageAccessCheck component={<IndustryCategory />} />}
              />

              <Route
                exact
                path="email-settings/:menuGroupId"
                element={<PageAccessCheck component={<EmailTemplate />} />}
              />
              <Route
                exact
                path="shipping"
                element={<PageAccessCheck component={<ShippingMethod />} />}
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
                path="app-settings"
                element={<PageAccessCheck component={<AppSetting />} />}
              />

              <Route
                exact
                path="web-setting"
                element={<PageAccessCheck component={<WebSetting />} />}
              />

              <Route
                exact
                path="banner-setting"
                element={<PageAccessCheck component={<BannerGroup />} />}
              />

              <Route
                exact
                path="banner-setting/:bannerGroupId"
                element={<PageAccessCheck component={<Banner />} />}
              />

              <Route
                exact
                path="menu-setting"
                element={<PageAccessCheck component={<MenuGroup />} />}
              />

              <Route
                exact
                path="menu-setting/:menuGroupId"
                element={<PageAccessCheck component={<Menu />} />}
              />

              <Route
                exact
                path="payment"
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
                path="setting-group"
                element={<PageAccessCheck component={<SettingGroupList />} />}
              />

              <Route
                exact
                path="setting-group/view/:groupId"
                element={<PageAccessCheck component={<EditSettingGroup />} />}
              />

              <Route
                exact
                path="web-setting-group"
                element={<PageAccessCheck component={<WebSettingGroup />} />}
              />

              <Route
                exact
                path="web-setting-group/view/:groupId"
                element={
                  <PageAccessCheck component={<EditWebSettingGroup />} />
                }
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
                path="template"
                element={<PageAccessCheck component={<Template />} />}
              />

              <Route
                exact
                path="template-component"
                element={<PageAccessCheck component={<TemplateComponent />} />}
              />

              <Route
                exact
                path="product-type"
                element={<PageAccessCheck component={<ProductType />} />}
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
              {/* commerce */}
              <Route
                exact
                path="categories"
                element={<PageAccessCheck component={<Category />} />}
              />

              <Route
                exact
                path="products"
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
    <SuperAdmin>
      <Outlet />
    </SuperAdmin>
  );
}
function SuperAdminLayout() {
  return (
    // <SuperAdmin>
    <Outlet />
    // </SuperAdmin>
  );
}

export default App;
