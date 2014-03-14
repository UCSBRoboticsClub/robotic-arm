/* 3/8/2014 8:24:02 AM, 115*/
/// <reference path="MyDEVReferences.js" />
if (this.InLnOrdWebPart) {
	// Continue
} else {

InLnOrdWebPart = new function () {
    /// <summary>
    /// Contains client-side functionality for the Inline Ordering web part.
    /// </summary>

	/// #Region "Declarations"
	var Me = this
		  , INLN_ORD_HTTP_HANDLER_URL = "/WebParts/Ordering/InLnOrdWebpart/InLnOrd.aspx"
		  , ACT_TXT = "acttxt"
		  , ADD_ITM_CURR_ORD_QS_KY_TXT = "additmcurrord"
		  , GET_ORD_HIST_QS_KY_TXT = "getordhist"
		  , GET_ADDNL_CNTNT_LNKS_QS_KY_TXT = "getaddnlcntntlnks"
		  , UPDT_ATTR_QS_KY_TXT = "updtattr"
		  , QTY_TXT_QS_KY_TXT = "qtytxt"
		  , PART_NBR_QS_KY_TXT = "partnbrtxt"
		  , INTRN_PART_NBR_QS_KY_TXT = "intrnpartnbrtxt"
		  , ATTR_VAL_QS_KY_TXT = "attrval"
		  , ATTR_NM_QS_KY_TXT = "attrnm"
		  , SPEC_ITM_QS_KY_TXT = "specitm"
		  , ATTR_MSTR_AVAIL_LENS = "attrmstravaillens"
		  , FIRM_PKG_ERR_IND = "firmpkgerrind"
		  , QTY_ERR_SHOWING_IND = "qtyerrshowingind"
		  , ATTR_ERR_SHOWING_IND = "attrerrshowingind"
		  , ENT_KY_CD = 13
		  , IDSTRARR_PARTNUMBER_INDEX = 2
		  , IDSTRARR_ATTRNAME_INDEX = 1
		  , ATTR_DROP_DOWN_BORDER = 1
		  , TOOLSET_HGT
		  , MASTHEAD_HGT
		  , BOTTOMNAVTOOLSET_HGT
		  , SCROLLBUFFER = 40
		  , HORZSCROLLBARBUFFER = 10
		  , BUFFER_HGT = 4
		  , SPEC_TXT_LMT = 250
		  , ELLPSS_WDTH = 9
		  , DRP_DWN_RT_SD_WDTH = 30
		  , CHLD_ATTR_TOP_BORDER = 5
          , PUB_ATTR_ID_IDX = 3
		  , mMainContentCntnr
		  , mCtlgShellCntnr
		  , mWebPartObj
		  , mReadyNxtAjaxCallInd = true
		  , mMetaDat
		  , mMetaDatDict = {}
		  , mAttrbtSlctdTbl = new CmnColls.HashTable()
		  , mAttrErrInd = false
		  , mBxObj
		  , mCrtedBxObjs = []
		  , mCrtedBxObjsIdx = 0
		  , mInLnOrdWebPartJSObj
		  , valDefs = McMaster.SesnMgr.StValDefs
		  , setVal = McMaster.SesnMgr.SetStVal
		  , getVal = McMaster.SesnMgr.GetStVal
		  , remVal = McMaster.SesnMgr.RemStVal
		  , PROD_ATTR_ID_IDX = 2
		  , PROD_VAL_ID_IDX = 5
		  , PUB_VAL_ID_IDX = 6
		  , OTHER_DOMAIN_TXT = "Other_Domain"
		  , OTHER_VAL_TXT = "Other"
		  , APP_MODE_PREF_TXT = "appmode"
		  , ZERO_WIDTH_SPACE = String.fromCharCode(parseInt(0x200B));
		  
	//for feature activation for item presentation product detail link
	var PROD_DET_LNK_ACTVN_IND_QS_KY_TXT = "proddetlnkactvnind";
		  
    //Environment constants
    var PUB_DEV = "pubdev",
			DEV = "wwwdev",
			PUB_QUAL = "pubqual",
			QUAL = "wwwqual",
			PROD = "www",
			PUB = "pub";
    //Inline order spec change
    //New constants and global variables for inline specs
    var ATTR_COMP_IDS = "attrCompIds",
	    IS_INLNSPEC = "isInLnSpec",
		FULL_PRSNTTN_ID_KY_TXT = "fullprsnttnid",
		PRSNTTN_ID_KY_TXT = "prsnttnid";

    var ATTR_VAL_HIGHLIGHTED_CLS = "SpecSrch_Value_OrdrdLnk";
    /// #End Region

    /// #Region "Event Handlers"
    Me.WebPart_Load = function (webPartObj) {
        webPartObj.PartNbrLnk = fndPartNbrLnkByClsNm(webPartObj.MetaDat.PartNbrTxt, "PartNbrLnk");
        InLnOrdWebPart.WebPart_AssocFilesLoad(webPartObj);
    }
	
    // <summary>
    // Called when the web part loads and performs initialization
    // functionality.
    // </summary>
    // <param name="webPartObj">
    // The current web part object.
    // </param>
    Me.WebPart_AssocFilesLoad = function (webPartObj) {
        // Get masthead, toolset and bottom nav toolset heights for scrolling purposes.
        try {
			mMainContentCntnr = Cmn.GetObj("MainContent");
			mWebPartObj = webPartObj;
			mMetaDat = webPartObj.MetaDat;
			mMetaDatDict[mMetaDat.PartNbrTxt] = mMetaDat;

			var bxObj
			  , crtdBxs;

			var toolSetCntnr = Cmn.GetElementBy(function (elem) { return Cmn.HasCls(elem, "WebToolsetWebPart_Cntnr"); }, "div", mMainContentCntnr);
			if (toolSetCntnr) {
				TOOLSET_HGT = Cmn.GetHeight(toolSetCntnr);
			} else {
				TOOLSET_HGT = 0;
			}
			var headerCntnr = Cmn.GetObj("ShellLayout_Header_Cntnr")
			if (headerCntnr) {
				MASTHEAD_HGT = Cmn.GetHeight(headerCntnr);
			} else {
				MASTHEAD_HGT = 0;
			}
			var bottomNavCntnr = Cmn.GetObj("Shell_BottomNavWebPart_Cntnr")
			if (bottomNavCntnr) {
				BOTTOMNAVTOOLSET_HGT = Cmn.GetHeight(bottomNavCntnr);
			} else {
				BOTTOMNAVTOOLSET_HGT = 0;
			}

			// Add the event listeners for the attribute menu. 			
			if (mMainContentCntnr) {
				var inLnBxRws = Cmn.GetElementsByClsNm("AddToOrdFlow_ItmBx", "tr", mCtlgShellCntnr);
				if (inLnBxRws && inLnBxRws.length > 2) {
					// Do nothing, the event listener will already have been added.
				} else {
					Cmn.RemEvntListener(mMainContentCntnr, "click", hndlClickEvnt);
					Cmn.AddEvntListener(mMainContentCntnr, "click", hndlClickEvnt);
				}

				mInLnOrdWebPartJSObj = InLnOrdWebPartJSObj;

			} else {
				mCtlgShellCntnr = Cmn.GetObj("CtlgPageShell_CtlgPage_Cntnr");

				if (mCtlgShellCntnr) {
					// Check to make sure that there is not already another box loaded
					// since the event listener added with it handles all clicks.
					var inLnBxRws = Cmn.GetElementsByClsNm("AddToOrdFlow_ItmBx", "tr", mCtlgShellCntnr);
					if (inLnBxRws && inLnBxRws.length > 2) {
						// Do nothing, the event listener will already have been added.
					} else {
						Cmn.RemEvntListener(mCtlgShellCntnr, "click", hndlClickEvnt);
						Cmn.AddEvntListener(mCtlgShellCntnr, "click", hndlClickEvnt);
					}
				}

				mInLnOrdWebPartJSObj = self.parent.parent.InLnOrdWebPartJSObj;
			}

			bxObj = new mInLnOrdWebPartJSObj.BxObj(mWebPartObj.PartNbrLnk, mWebPartObj);
			mBxObj = bxObj;

			// Call the dynamic rendering javascript to generate the markup.
			InLnOrdWebPartDynamicRendering.WebPart_Load(mBxObj);

			//Inline order spec 
			//determines if the inline box contains a specification from MDM 
			var partNbrLnk = webPartObj.PartNbrLnk;
			var getLinks = true;

			if (isInLnSpec(partNbrLnk)) {

				//this means we are dealing with inline order specs
				updtInlnSpecInteractions(webPartObj);
				Cmn.AddCls(mBxObj.PartNbrLnk, "HasInLnOrdSpec");

				var parentRow,
					bxCntntRow,
					attrRow,
					attrs,
					valsSlctd,
					inLnSpecId,
					seqNbr;
					
				//attach event listeners to title input boxes. Not done otherwise.
				var specCntnr = Cmn.Get("InLnOrdWebPartAttrCntnr" + webPartObj.PartNbrLnk.innerHTML);
				
				if (specCntnr) {
					var inpDomBxs = Cmn.GetElementsByClsNm("OtherValInpBx", "input", specCntnr);				
					for (var inpDomBxIndx = 0; inpDomBxIndx < inpDomBxs.length; inpDomBxIndx++) {
						Cmn.AddEvntListener(inpDomBxs[inpDomBxIndx], "blur", function (e) {
							InLnOrdWebPart.HndlKeyDownEvnt(e, webPartObj);
						});
						Cmn.AddEvntListener(inpDomBxs[inpDomBxIndx], "focus", function (e) {
						});
					}
					// attach event listeners to sized input box.
					var sizedInpBx = Cmn.GetElementsByClsNm("SizedInpBx", "textarea", specCntnr)[0];
					if (sizedInpBx){
						Cmn.AddEvntListener(sizedInpBx,"keydown",function(e){InLnOrdWebPart.HndlEvntOnKeyDown(e, webPartObj)});
						Cmn.AddEvntListener(sizedInpBx,"keypress",function(e){InLnOrdWebPart.HndlKeyPressEvnt(e,webPartObj);});
						Cmn.AddEvntListener(sizedInpBx,"paste",function(e){InLnOrdWebPart.HndlPasteEvnt(e,webPartObj);});
						Cmn.AddEvntListener(sizedInpBx,"blur",function(e){InLnOrdWebPart.HndlBlurEvnt(e,webPartObj);});
					}
				}
						
				if (chkCtlgPageInd()) {
					var mainIFrame = document.getElementById("MainIFrame");
					var ctlgPageElem = getObjFrmIFrameById(mainIFrame, "Catalog");

					specCntnr = getObjFrmIFrameById(ctlgPageElem, "InLnOrdWebPartAttrCntnr" + webPartObj.PartNbrLnk.innerHTML);
					if(!(specCntnr)){
						specCntnr = Cmn.Get("InLnOrdWebPartAttrCntnr" + webPartObj.PartNbrLnk.innerHTML);
					}
					if (specCntnr) {
						var inpDomBxs = Cmn.GetElementsByClsNm("OtherValInpBx", "input", specCntnr);
						for (var inpDomBxIndx = 0; inpDomBxIndx < inpDomBxs.length; inpDomBxIndx++) {
							Cmn.AddEvntListener(inpDomBxs[inpDomBxIndx], "blur", function (e) {
								InLnOrdWebPart.HndlKeyDownEvnt(e, webPartObj);
							});
							Cmn.AddEvntListener(inpDomBxs[inpDomBxIndx], "focus", function (e) {
							});
						}
						// attach event listeners to sized message box. 
						var sizedInpBx = Cmn.GetElementsByClsNm("SizedInpBx", "textarea", specCntnr)[0];
						if (sizedInpBx){
							Cmn.AddEvntListener(sizedInpBx,"keydown",function(e){InLnOrdWebPart.HndlEvntOnKeyDown(e, webPartObj)});
							Cmn.AddEvntListener(sizedInpBx,"keypress",function(e){InLnOrdWebPart.HndlKeyPressEvnt(e,webPartObj);});
							Cmn.AddEvntListener(sizedInpBx,"paste",function(e){InLnOrdWebPart.HndlPasteEvnt(e,webPartObj);});
							Cmn.AddEvntListener(sizedInpBx,"blur",function(e){InLnOrdWebPart.HndlBlurEvnt(e,webPartObj);});
						}
					}
					parentRow = partNbrLnk;
					while (parentRow.tagName != "TR") {
						parentRow = parentRow.parentNode;
					}
					bxCntntRow = parentRow.nextSibling.nextSibling;

					//find all the attributes for the given part number
					var attrsForPartNbr = [];
					var slctdValsForPartNbr = [];
					attrs = getObjFrmIFrameByClsNm(ctlgPageElem, "SpecSrch_Attribute");
					valsSlctd = getObjFrmIFrameByClsNm(ctlgPageElem, "SpecSrch_SlctdVal");

					if (attrs) {
						for (var i = 0; i < attrs.length; i++) {
							if (attrs[i].id.search(webPartObj.PartNbrLnk.innerHTML) > 0) {
								attrsForPartNbr.push(attrs[i]);
							}
						}
						//find all the selected values for the given part number
						for (var i = 0; i < valsSlctd.length; i++) {
							if (valsSlctd[i].id.search(webPartObj.PartNbrLnk.innerHTML) > 0) {
								slctdValsForPartNbr.push(valsSlctd[i]);
							}
						}
					}

					inLnSpecId = webPartObj.PartNbrLnk.innerHTML + '_' + webPartObj.PrsnttnId;
					
					seqNbr = webPartObj.PartNbrLnk.getAttribute("data-mcm-partnbr-seqnbr");
					if (seqNbr) {
						inLnSpecId = inLnSpecId + '_' + seqNbr;
					}
					
					if (attrsForPartNbr.length > 0 && attrsForPartNbr.length == slctdValsForPartNbr.length) {
						InLnOrdWebPart.updtSpecAttr(inLnSpecId);
						getLinks = false;
					} else {
						var stkmsgcntnr = getObjFrmIFrameById(ctlgPageElem, "InLnOrdWebPart_StkMsg" + webPartObj.PartNbrLnk.innerHTML)
						if(!(stkmsgcntnr)){
							stkmsgcntnr = Cmn.Get("InLnOrdWebPart_StkMsg" + webPartObj.PartNbrLnk.innerHTML);
						}
						// Take away the stock status.
						if (stkmsgcntnr) {
							stkmsgcntnr.innerHTML = "";
						}
					}

				} else {
					parentRow = Cmn.GetAncestorByTagNm(webPartObj.PartNbrLnk, "TR");
					bxCntntRow = Cmn.GetNxtSibling(Cmn.GetNxtSibling(parentRow));
					seqNbr = webPartObj.PartNbrLnk.getAttribute("data-mcm-partnbr-seqnbr");
					//checks to make sure that every attribute has a value selected before getting the stock message
					attrRow = Cmn.GetElementsByClsNm("InLnOrdWebPartAttrCntnr", "div", bxCntntRow)[0];
					//get all the attributes in the box
					attrs = Cmn.GetElementsByClsNm("SpecSrch_Attribute", "div", attrRow);
					//gets all the values selected
					valsSlctd = Cmn.GetElementsByClsNm("SpecSrch_SlctdVal", 'td', attrRow)
					inLnSpecId = webPartObj.PartNbrLnk.innerHTML + '_' + webPartObj.PrsnttnId;
					if (seqNbr) {
						inLnSpecId = inLnSpecId + '_' + seqNbr;
					}
					
					if (attrs.length == valsSlctd.length) {
						InLnOrdWebPart.updtSpecAttr(inLnSpecId);
						getLinks = false;
					} else {
						var stkmsgcntnr = Cmn.Get("InLnOrdWebPart_StkMsg" + webPartObj.PartNbrLnk.innerHTML)
						// Take away the stock status.
						if (stkmsgcntnr) {
							stkmsgcntnr.innerHTML = "";
						}
					}
				}
			}

			// Set the properties on the box object that are associated with the markup just dynamically
			// generated for this part number. 
			mInLnOrdWebPartJSObj.SetMarkupProperties(mBxObj);

			//Get Environment
			var envr = Cmn.GetApplEnvrPrfx() + Cmn.GetApplEnvrSfx();

			//Make the additional content AJAX calls.
			//Don't make call in Pub Environments
			
			switch (envr) {
				case (PUB_DEV):
				case (PUB_QUAL):
				case (PUB):
					break;
				default:
					Me.GetOrdHist(mBxObj);
					if (getLinks) {
						Me.GetAddnlCntntLnks(mBxObj);
					}
					Me.HighlightRelevantInLnSpecMarkup(mBxObj);
			} 

			// If we're on a catalog page, we need to make sure the global variables at the
			// shell level reflect the values on the catalog page. 
			if (mCtlgShellCntnr) {
				McMasterCom.Nav.GetTopFrame().InLnOrdWebPart.SetJSBxObjProperties(bxObj);
			}

			setVal(valDefs.ActvInLnOrdBx.KyTxt(), bxObj);

			mBxObj = getVal(valDefs.ActvInLnOrdBx.KyTxt());

			Cmn.AddCls(mBxObj.PartNbrCell, "AddToOrdBxCreated");
			Cmn.AddCls(mBxObj.PartNbrLnk, "PartNbrSlctd");
			Cmn.AddCls(mBxObj.PartNbrLnk, "AddToOrdBxCreated");

			// Set the global variables associated with the javascript objects.
			if (typeof (mCrtedBxObjs) == "object") {
				// Session inexplicably clones arrays incorrectly when we're
				// in iFrames. Recast the (now) object back to an array.
				var bxIdx = 0
					  , tempArray = [];

				while (mCrtedBxObjs[bxIdx]) {
					if (mCrtedBxObjs[bxIdx].PartNbrTxt != mBxObj.PartNbrTxt) {
						tempArray.push(mCrtedBxObjs[bxIdx]);
					}
					bxIdx++;
				}

				mCrtedBxObjs = tempArray;
			}

			mCrtedBxObjs.push(mBxObj);
			mCrtedBxObjsIdx++;
			setVal(valDefs.InLnOrdBxsCrtd.KyTxt(), mCrtedBxObjs);
			if (webPartObj.AutoSlctdPartNbrInd == undefined || webPartObj.AutoSlctdPartNbrInd == false) {
				// Take a back button snap shot only if the part 
				// number is explicitly selected by the customer
				Me.TakeSnapShot();
			}
			mCrtedBxObjs = getVal(valDefs.InLnOrdBxsCrtd.KyTxt());

			//set cursor position
			setCursorPos(bxObj);

			InLnOrdWebPart.ScrollToShowInLnOrdCntnr();

			// Build and publish a loaded message.
			var msgNm, msgHdr, webPartLoadedMsg;
			msgNm = McMaster.MsgMgr.CntxtNms.INLN_ORD;
			msgHdr = new McMaster.MsgMgr.Hdr(msgNm);

			// Create the web part loaded message. 
			webPartLoadedMsg = new McMaster.MsgMgrMsgs.WebPartLoaded(msgHdr, webPartObj.CntnrIDTxt);

			// Publish the web part loaded message. 
			McMaster.MsgMgr.PubMsg(webPartLoadedMsg);
					
			// Track the event for web performance.
			var top = McMasterCom.Nav.GetTopFrame();
			new top.PerfTracker.Evnt(top.PerfTracker.EvntNms.InLnOrdLdEnd, top.PerfTracker.PgCntxtNms.DynCntnt);
		} catch (ex) {
			//do nothing
		}
    }
	
    // -------------------------------------------------
    // Summary: Handle key down event 
    // Input: event
    // --------------------------------------------------
    Me.HndlKeyDownEvnt = function (e, webPartObj, respArgs) {
        if (e) {
			var mainCntnr,
			    inLnSpecId;
            var kyCd = e.keyCode;
			var clickedElem = Cmn.GetEvntTarget(e);
			
			if (webPartObj.MetaDat) {
				mainCntnr = Cmn.Get("InLnOrdWebPart_Main" + webPartObj.MetaDat.PartNbrTxt);
			} else if (respArgs && respArgs.PartNbrTxt) {
				mainCntnr = Cmn.Get("InLnOrdWebPart_Main" + respArgs.PartNbrTxt);
			} 
			if (mainCntnr == null && Cmn.HasCls(clickedElem, "OtherValInpBx")){
				mainCntnr = Cmn.GetAncestorByClsNm(clickedElem, "InLnOrdWebPartLayout_Main");
			}
			
			var inLnSpecId = Cmn.GetElementsByClsNm("InLnOrdWebPartAttrCntnr", "div", mainCntnr)[0].getAttribute("data-InLnSpecId");
			
			var stkmsgcntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_StkMsg", "div", mainCntnr)[0];
			if (!stkmsgcntnr) {
				//look for cntnr with alternate class name
				stkmsgcntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_StkMsgPacks", "div", mainCntnr)[0];
			}
			var qtyErrCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_QtyErr", "div", mainCntnr)[0];
			//Cmn.ReplaceCls(qtyErrCntnr, "Show", "Hide");

			var htmlElem;
			var specAttrCntnr = Cmn.GetAncestorByClsNm(clickedElem, "SpecSrch_Attribute");
			if (specAttrCntnr) {
				 htmlElem = Cmn.GetElementsByClsNm("SpecSrch_Value", "td", specAttrCntnr);
			}
			if (htmlElem && htmlElem.length == 1) {
				if (Cmn.HasCls(htmlElem[0], "SpecSrch_SlctdVal")) { //for title input boxes
					//do nothing
				} else {
					
					if (htmlElem[0].innerHTML.lastIndexOf(OTHER_DOMAIN_TXT, 0) === 0) { 
						var attrIdArray = htmlElem[0].id.split("_")
						var pubAttrId = attrIdArray[PUB_ATTR_ID_IDX];
						var prodAttrId = attrIdArray[PROD_ATTR_ID_IDX];
						var prodValId = attrIdArray[PROD_VAL_ID_IDX];
						var pubValId = attrIdArray[PUB_VAL_ID_IDX];

						var inLnSpecDict = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.InLnSpecUsrInps.KyTxt());
						var cntxtNm = "InLnOrd";
						if (inLnSpecDict[inLnSpecId].ValExists(prodAttrId, prodValId, cntxtNm)) {
							inLnSpecDict[inLnSpecId].RemVal(prodAttrId, prodValId, cntxtNm);
						}
						inLnSpecDict[inLnSpecId].ToggleVal(prodAttrId, pubAttrId, prodValId, pubValId, cntxtNm);
						McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.InLnSpecUsrInps.KyTxt(), inLnSpecDict);
					}
				}
			}
			
			var otherInpBxs = Cmn.GetElementsByClsNm("OtherValInpBx", "input", mainCntnr);
			if (otherInpBxs) {
				for (var i = 0; i < otherInpBxs.length; i++) {
					var otherBx = otherInpBxs[i];
					if (otherBx && otherBx.value.length == 0) {
						stkmsgcntnr.innerHTML = "";
						Cmn.ReplaceCls(qtyErrCntnr, "Show", "Hide");
					}
				}   
				InLnOrdWebPart.updtSpecAttr(inLnSpecId, clickedElem);
			}
			setVal(valDefs.ActvInLnOrdBx.KyTxt(), mBxObj);
        }
    };
	
	//-------------------------------------------------------------------------
	// <summary>
	// Handles a keydown event.
	// </summary>
	// <param name="e">The event.</param>
	//-------------------------------------------------------------------------		
	Me.HndlEvntOnKeyDown = function(e, webPartObj, respArgs){
		if (e){
			var targetElem = Cmn.GetEvntTarget(e);
			
			var mainCntnr;
			if (webPartObj.MetaDat) {
				mainCntnr = Cmn.Get("InLnOrdWebPart_Main" + webPartObj.MetaDat.PartNbrTxt);
			} else if (respArgs && respArgs.PartNbrTxt) {
				mainCntnr = Cmn.Get("InLnOrdWebPart_Main" + respArgs.PartNbrTxt);
			}
			if (mainCntnr == null && 
				(Cmn.HasCls(targetElem, "InLnOrdWebPartLayout_OtherInpBx") ||
				Cmn.HasCls(targetElem, "OtherValInpBx")) ) {
				mainCntnr = Cmn.GetAncestorByClsNm(targetElem, "InLnOrdWebPartLayout_Main");
			}
			
			//t2emc
			var sizedInpBx = Cmn.GetElementsByClsNm("SizedInpBx", "textarea", mainCntnr)[0];
			if (sizedInpBx && sizedInpBx === targetElem){
				SpecInteractions.SizedInpTyping(targetElem,e);
				SpecInteractions.SizedInpArrowKeys(targetElem,e);
			}
		}	
	}
	
	Me.HndlBlurEvnt = function(e, webPartObj){
		if (e){
			var blurElem = Cmn.GetEvntTarget(e);
			if(Cmn.HasCls(blurElem, "SizedInpBx")){
				var mainCntnr,
					inLnSpecId;
				if (webPartObj.MetaDat) {
					mainCntnr = Cmn.Get("InLnOrdWebPart_Main" + webPartObj.MetaDat.PartNbrTxt);
				} else if (mainCntnr == null){
					mainCntnr = Cmn.GetAncestorByClsNm(blurElem, "InLnOrdWebPartLayout_Main");
				}			
				var inLnSpecId = Cmn.GetElementsByClsNm("InLnOrdWebPartAttrCntnr", "div", mainCntnr)[0].getAttribute("data-InLnSpecId");
				var stkmsgcntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_StkMsg", "div", mainCntnr)[0];
				if (!stkmsgcntnr) {
					//look for cntnr with alternate class name
					stkmsgcntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_StkMsgPacks", "div", mainCntnr)[0];
				}
				var qtyErrCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_QtyErr", "div", mainCntnr)[0];
				//Cmn.ReplaceCls(qtyErrCntnr, "Show", "Hide");
				
				var htmlElem;
				var specAttrCntnr = Cmn.GetAncestorByClsNm(blurElem, "SpecSrch_Attribute");
				if (specAttrCntnr) {
					 htmlElem = Cmn.GetElementsByClsNm("SpecSrch_Value", "td", specAttrCntnr);
				}
				if (htmlElem && htmlElem.length == 1) {
					if (specAttrCntnr.innerHTML.lastIndexOf("Other") > -1) { //for title input boxes
						if (htmlElem[0].innerHTML.lastIndexOf(OTHER_DOMAIN_TXT, 0) === 0) { 
							var attrIdArray = htmlElem[0].id.split("_")
							var pubAttrId = attrIdArray[PUB_ATTR_ID_IDX];
							var prodAttrId = attrIdArray[PROD_ATTR_ID_IDX];
							var prodValId = attrIdArray[PROD_VAL_ID_IDX];
							var pubValId = attrIdArray[PUB_VAL_ID_IDX];

							var inLnSpecDict = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.InLnSpecUsrInps.KyTxt());
							var cntxtNm = "InLnOrd";
							if (inLnSpecDict[inLnSpecId].ValExists(prodAttrId, prodValId, cntxtNm)) {
								inLnSpecDict[inLnSpecId].RemVal(prodAttrId, prodValId, cntxtNm);
							}
							inLnSpecDict[inLnSpecId].ToggleVal(prodAttrId, pubAttrId, prodValId, pubValId, cntxtNm);
							McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.InLnSpecUsrInps.KyTxt(), inLnSpecDict);
						}
					}
				}
				
				var sizedInpBx = Cmn.GetElementsByClsNm("SizedInpBx", "textarea", mainCntnr)[0];
				if (sizedInpBx && sizedInpBx.value.length == 0) {
					stkmsgcntnr.innerHTML = "";
					Cmn.ReplaceCls(qtyErrCntnr, "Show", "Hide");
					//InLnOrdWebPart.updtSpecAttr(inLnSpecId, blurElem);
				} else if (sizedInpBx){
					//stkmsgcntnr.innerHTML = webPartObj.MetaDat.StkMsg;
					var datetime = new Date();
					stkmsgcntnr.innerHTML = webPartObj.MetaDat.StkMsg;
					Cmn.ReplaceCls(qtyErrCntnr, "Hide", "Show");
					//InLnOrdWebPart.updtSpecAttr(inLnSpecId, blurElem);
				}
				setVal(valDefs.ActvInLnOrdBx.KyTxt(), mBxObj);
			}
		}	
	};
	
	//-------------------------------------------------------------------------
	// <summary>
	// Handles a keypress event.
	// </summary>
	// <param name="e">The event.</param>
	//-------------------------------------------------------------------------		
	Me.HndlKeyPressEvnt = function(e, webPartObj, respArgs){
		if (e){
			var targetElem = Cmn.GetEvntTarget(e);
			
			var mainCntnr;
			if (webPartObj.MetaDat) {
				mainCntnr = Cmn.Get("InLnOrdWebPart_Main" + webPartObj.MetaDat.PartNbrTxt);
			} else if (respArgs && respArgs.PartNbrTxt) {
				mainCntnr = Cmn.Get("InLnOrdWebPart_Main" + respArgs.PartNbrTxt);
			}
			if (mainCntnr == null && 
				(Cmn.HasCls(targetElem, "OtherValInpBx") ||
				Cmn.HasCls(targetElem, "InLnOrdWebPartLayout_OtherInpBx")) ) {
				mainCntnr = Cmn.GetAncestorByClsNm(targetElem, "InLnOrdWebPartLayout_Main");
			}
			
			var sizedInpBx = Cmn.GetElementsByClsNm("SizedInpBx", "textarea", mainCntnr)[0];
			if (sizedInpBx && sizedInpBx === targetElem){
				SpecInteractions.SizedInpTyping(targetElem,e);
			}
		}	
	}

	//-------------------------------------------------------------------------
	// <summary>
	// Handles a paste event.
	// </summary>
	// <param name="e">The event.</param>
	//-------------------------------------------------------------------------		
	Me.HndlPasteEvnt = function(e, webPartObj, respArgs){
		if (e){
			var targetElem = Cmn.GetEvntTarget(e);
			
			var mainCntnr;
			if (webPartObj.MetaDat) {
				mainCntnr = Cmn.Get("InLnOrdWebPart_Main" + webPartObj.MetaDat.PartNbrTxt);
			} else if (respArgs && respArgs.PartNbrTxt) {
				mainCntnr = Cmn.Get("InLnOrdWebPart_Main" + respArgs.PartNbrTxt);
			} 
			if (mainCntnr == null && 
				(Cmn.HasCls(targetElem, "InLnOrdWebPartLayout_OtherInpBx") ||
				Cmn.HasCls(targetElem, "OtherValInpBx")) ) {
				mainCntnr = Cmn.GetAncestorByClsNm(targetElem, "InLnOrdWebPartLayout_Main");
			}
			
			var sizedInpBx = Cmn.GetElementsByClsNm("SizedInpBx", "textarea", mainCntnr)[0];
			if (sizedInpBx && sizedInpBx === targetElem){
				SpecInteractions.SizedInpPaste(targetElem,e);
			}
		}	
	}
	
	// <summary>
    // If an inline box has been created before, we need to refresh the global variable
    // used in this file so that we know which box is "active."
    // </summary>
    // <param nm="partNbrLnk">
    // We use the part number link to identify the box object.
    // </param>
    Me.RegenerateJSBxObj = function (partNbrLnk) {

        var partId = partNbrLnk.getAttribute("data-mcm-itm-id")
				, crtdBxs = getVal(valDefs.InLnOrdBxsCrtd.KyTxt());

        // Set the global variables associated with the javascript objects.
        if (typeof (crtdBxs) == "object") {
            // Session inexplicably clones arrays incorrectly when we're
            // in iFrames. Recast the (now) object back to an array.
            var bxIdx = 0
				  , tempArray = [];

            while (crtdBxs[bxIdx]) {
                tempArray.push(crtdBxs[bxIdx]);
                bxIdx++;
            }

            crtdBxs = tempArray;
        }

        for (var bxIdx = 0; bxIdx < crtdBxs.length; bxIdx++) {
            if (crtdBxs[bxIdx].Id == partId
				   && crtdBxs[bxIdx].PrimaryPartNbrTxts == "") {
                InLnOrdWebPart.SetJSBxObjProperties(crtdBxs[bxIdx]);
                break;
            } else {
                // If this part appears more than once on the page, we have
                // to make sure we have the correct one. 
                if (crtdBxs[bxIdx].PrimaryPartNbrTxts.length > 0) {
                    var parentRow = Cmn.GetAncestorByTagNm(partNbrLnk, "tr")
						  , partNbrLnks = Cmn.GetElementsByClsNm("PartNbrLnk", "a", parentRow)
						  , primArr = [];

                    for (var lnkIdx = 0; lnkIdx < partNbrLnks.length; lnkIdx++) {
                        if (partNbrLnks[lnkIdx].getAttribute("data-mcm-itm-id") != partId) {
                            primArr.push(partNbrLnks[lnkIdx].getAttribute("data-mcm-itm-id"));
                        } else {
                            // Continue.
                        }
                    }

                    for (var primIdx = 0; primIdx < primArr.length; primIdx++) {
                        if ((crtdBxs[bxIdx].PrimaryPartNbrTxts.indexOf(primArr[primIdx]) > -1)) {
                            InLnOrdWebPart.SetJSBxObjProperties(crtdBxs[bxIdx]);
                            break;
                        }
                    }
                }
            }
        }
    }

    Me.SetJSBxObjProperties = function (bxObj) {
        /// <summary>
        /// If an inline box has been created before, we need to refresh the global variable
        /// used in this file so that we know which box is "active." 
        /// </summary>

        if (Cmn.GetObj("MainContent")) {
            // Dynamic content
            InLnOrdWebPartJSObj.SetMarkupProperties(bxObj);
        } else {
            // Catalog pages.
            self.parent.parent.InLnOrdWebPartJSObj.SetMarkupProperties(bxObj);
        }

        mBxObj = bxObj;
    }

    Me.WebPart_PreUnload = function (webPartObj) {
        // Remove event listeners
        if (mMainContentCntnr) {
            // Check to make sure that there is not already another box loaded
            // for then we want to leave the event listener for that box.
            var inLnBxRws = Cmn.GetElementsByClsNm("AddToOrdFlow_ItmBx", "tr", mMainContentCntnr);
            if (inLnBxRws && inLnBxRws.length > 2) {
                // remove nothing so attribute menus will continue to work for open boxes.
            } else {
                Cmn.RemEvntListener(mMainContentCntnr, "click", hndlClickEvnt);
            }
        } else if (mCtlgShellCntnr) {
            // Check to make sure that there is not already another box loaded
            // for then we want to leave the event listener for that box.
            var inLnBxRws = Cmn.GetElementsByClsNm("AddToOrdFlow_ItmBx", "tr", mCtlgShellCntnr);
            if (inLnBxRws && inLnBxRws.length > 2) {
                // remove nothing so attribute menus will continue to work for open boxes.
            } else {
                Cmn.RemEvntListener(mCtlgShellCntnr, "click", hndlClickEvnt);
            }
        } else {
            // do nothing as neither container we add listeners to is available.
        }
    };

    Me.WebPart_Unload = function (webPartObj) {
        /// <summary>
        /// Called just prior to the web part unloading and takes steps to clean
        /// up global data and report the unload to the rest of the site.
        /// </summary>
        /// <param name="webPartObj">
        /// The current web part object.
        /// </param>					

        // Create a web part unloaded message. 
        var msgNm = McMaster.MsgMgr.CntxtNms.INLN_ORD
			  , msgHdr = new McMaster.MsgMgr.Hdr(msgNm)
			  , cntnrNm = webPartObj.CntnrIDTxt
			  , webPartUnLoadedMsg = new McMaster.MsgMgrMsgs.WebPartUnloaded(msgHdr, cntnrNm);

        // Publish the message
        McMaster.MsgMgr.PubMsg(webPartUnLoadedMsg);
		
		//unload spec
        //        var inLnBxs = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.InLnOrdBxsCrtd.KyTxt())
        //        for (var inLnBxIdx = 0; inLnBxIdx < inLnBxs.length; inLnBxIdx++) {
        //            if (inLnBxs[inLnBxIdx].mWebPartObj.CntnrIDTxt == webPartObj.CntnrIDTxt) {
        //                mBxObj = inLnBxs[inLnBxIdx];
        //            }
        //        }	
		if (isInLnSpec(mBxObj.mWebPartObj.PartNbrLnk)) {
			unloadSpec();
		}

		        // Remove all state values associated with the part number.
        remStVals();

		try{
        // If the box is loaded in a catalog page, we will need to remove the box on an unload.
			if (McMasterCom.Nav.GetTopFrame().MainIFrame.Catalog) {
				if (mBxObj.VisibilityInd == true) {
					var tblBody = Cmn.GetAncestorByTagNm(mBxObj.PartNbrLnk, 'tbody')
					  , inLnOrdBxs = Cmn.GetElementsByClsNm("AddToOrdFlow_ItmBxFor" + mBxObj.Id, 'tr', tblBody)
					  , tRow = Cmn.GetAncestorByTagNm(mBxObj.PartNbrLnk, 'tr')
					  , partNbrTxt
					  , bufferRows;

					var specChoiceLnks = Cmn.GetElementsByClsNm("SpecChoiceSlctd", "a", tRow);
					for (var specChoiceLnkIdx = 0; specChoiceLnkIdx < specChoiceLnks.length; specChoiceLnkIdx++) {
						Cmn.ReplaceCls(specChoiceLnks[specChoiceLnkIdx], "SpecChoiceSlctd", "SpecChoiceVisitedLnk ");
					}

					var prceLnks = Cmn.GetElementsByClsNm("PrceLnkSlctd", "a", tRow);
					for (var prceLnksIdx = 0; prceLnksIdx < prceLnks.length; prceLnksIdx++) {
						Cmn.ReplaceCls(prceLnks[prceLnksIdx], "PrceLnkSlctd", "PrceLnkVisited ");
					}


					//get part number text
					if (mBxObj.PartNbrLnk.innerHTML.length > 0) {
						partNbrTxt = mBxObj.PartNbrLnk.innerHTML;
					} else {
						//partNbrCell that is passed into this function may not exist in the DOM
						//in that case, IE freaks out when trying to access the property
						//Instead of using innerHTML, use the hash. This is hackish.
						partNbrTxt = mBxObj.PartNbrLnk.hash.replace("#", "");
					}

					bufferRows = Cmn.GetElementsByClsNm("InLnOrdWebPart_BufferRowFor" + partNbrTxt, 'tr', tblBody);
					if (bufferRows.length > 0) {
						// Remove the buffer row.
						Cmn.RemElem(bufferRows[0]);
					}

					Cmn.RemCls(mBxObj.PartNbrLnk, "AddToOrdBxCreated");
					Cmn.RemCls(mBxObj.PartNbrLnk, "PartNbrSlctd");
					Cmn.ReplaceCls(mBxObj.PartNbrCell, "InLnOrdWebPartLayout_ItmTblPartNbrCell", "ItmTblColSpacePartNbr");
					Cmn.ReplaceCls(mBxObj.PartNbrCell, "AddToOrdBxCreated", "AddToOrdBxHidden");
					for (var bxIdx = 0; bxIdx < inLnOrdBxs.length; bxIdx++) {
						Cmn.RemElem(inLnOrdBxs[bxIdx]);
					}

					// Get the updated list of created boxes from session. 
					var crtdBxs = getVal(valDefs.InLnOrdBxsCrtd.KyTxt());

					// If we're on a catalog page, we need to update the value
					// of the global variable for the active box object.
					if (McMasterCom.Nav.GetTopFrame().MainIFrame.Catalog) {
						if (crtdBxs && crtdBxs.length > 0) {
							Me.SetJSBxObjProperties(crtdBxs[crtdBxs.length - 1]);
						}
					}
				} else {
					// Do nothing. InLnOrdWebPartLoader will take care of reinserting the 
					// box into the DOM if it's on a catalog page.
				}

					// TODO T2DXC: Remove the buffer rows as well!
				} else {
					// The box is not loaded in the catalog IFrame, so the box will be properly unloaded by
					// session/load manager.
				}
			} catch(ex){
				//do nothing
			}

        delete mMetaDatDict[mBxObj.PartNbrTxt];
        mMainContentCntnr = null;
        mCtlgShellCntnr = null;
        mCrtedBxObjs = [];
        mCrtedBxObjsIdx = 0;
        delete mBxObj;
    };

    Me.CadLnk_Click = function (partNbrTxt, intrnPartNbrTxt) {
        /// <summary>
        /// Redirects the customer to CAD content depending on what content is 
        /// available. 
        /// </summary>
        /// <param name="partNbrTxt"The part number text.></param>
        /// <param name="intrnPartNbrTxt"The internal part number text.></param>

        // Create a CAD content selected message. 
        var msgHdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.CAD_WEB_PART)
			  , cadMsg;

        // Set the state value in session for the selected part number. 
        setVal(valDefs.SlctdPartNbrTxt.KyTxt(), mBxObj.PartNbrTxt);

        // Create the CAD link selected message, setting the various part number texts
        // as the payload
        cadMsg = new McMaster.MsgMgrMsgs.CadLnkSlctd(msgHdr, partNbrTxt, intrnPartNbrTxt);

        // Publish the CAD selected message. 
        McMaster.MsgMgr.PubMsg(cadMsg);

        // Webreports tracking.
        Cmn.TrkAct("InLnOrdCADLnkClck&partnbr=" + partNbrTxt, "InLnOrd");
		
        // TrkSrch
        var srchTrkInfo = new SrchTrkr.SrchDat({ usr: SrchTrkr.UsrActTyps.SLCT });
        srchTrkInfo.usr.srcNm = "InLnOrdWebPart";
        srchTrkInfo.usr.slctdNm = partNbrTxt;
        srchTrkInfo.usr.elemTyp = SrchTrkr.ElemTyps.CAD_LNK;
        srchTrkInfo.Trk();

    };

	// <summary>
	// Redirects the customer to item presentation content.
	// </summary>
	// <param name="partNbrTxt"The part number text.></param>
	Me.ProdDetailLnk_Click = function (elem, partNbrTxt) {	
	
	   var testMthd = function(elem) {
			var successInd = false;
			if (elem.id == "InLnOrdWebPart_Lnks"+ partNbrTxt) {
				// current element has specified class
				// passes test
				successInd = true;
			}
			return successInd;
		}
		
		var lnkCntnr = Cmn.GetAncestorBy(elem, testMthd);
		if (lnkCntnr){
			//find the part number link to get data from
			var partNbrLnks = Cmn.GetElementsByClsNm("PartNbrLnk", "a");
			//Get sequence from the link container
			var seqNbr = lnkCntnr.getAttribute("data-mcm-partnbr-seqnbr");
			
			var partNbrLnk = null;
			for (var i=0; i<partNbrLnks.length; i++){
				if (partNbrLnks[i].innerHTML == partNbrTxt && Cmn.HasCls(partNbrLnks[i], "PartNbrSlctd")){
					if (seqNbr){
						//Check against the sequence number on the part number link
						var seqNbrOnPartNbrLnk = partNbrLnks[i].getAttribute("data-mcm-partnbr-seqnbr");
						if (seqNbr == seqNbrOnPartNbrLnk){
							partNbrLnk = partNbrLnks[i];
							break;
						}						
					}else{	
						partNbrLnk = partNbrLnks[i];
						break;
					}
				}
			}
			
			var attrCompItmIds = null;
			var prsnttnId = null;
			var isEasyToOrderAttrInd = false;
			var usrInp = null;
			var attrNms = "";
			var attrValsTxt = "";
			var attrnms = [];
			var attrvals = [];
			var inpBxVal = "";
			var qtyInpBxVal = "";
			
			//get main cntnr
			var box = Cmn.GetAncestorByClsNm(lnkCntnr, "InLnOrdWebPartLayout_CntntDiv");
			
			//save quantity if the customer has typed it in
			var qtyInpBx = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_InpBx", "input", box)[0];			
			if (qtyInpBx && qtyInpBx.value.length > 0) {
				qtyInpBxVal = qtyInpBx.value;
			}
						
			//found part number link
			if (partNbrLnk){
				attrCompItmIds = partNbrLnk.getAttribute("data-mcm-attr-comp-itm-ids");
				if (attrCompItmIds) isEasyToOrderAttrInd = true;
				
				var attrCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartAttrCntnr", "div", box)[0];
				if (attrCntnr) {
					//If we have an attrCntnr, try to get attributes that are selected to pass to product detail page. 
					//If we don't (this happens after placing an order), we want the product detail page to be a clean slate, no attrs selected.
					
					if (isEasyToOrderAttrInd){
						//new stuff
						prsnttnId = getPrsnttnId(partNbrLnk);
						var id = partNbrTxt + '_' + prsnttnId;
						if (seqNbr) id = id + '_' + seqNbr;
						var inLnSpecInpDict = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.InLnSpecUsrInps.KyTxt());
						if (inLnSpecInpDict && inLnSpecInpDict[id]) usrInp = inLnSpecInpDict[id].Clone();
						usrInp.UpdateSession();

						//Other input box logic.
						var otherInpBxs = Cmn.GetElementsByClsNm("OtherValInpBx", "input", box);

						//populate attrvals and attrnms with what's in Other
						if (otherInpBxs) {
							for (var i = 0; i < otherInpBxs.length; i++) {
								attrvals[attrvals.length] = otherInpBxs[i].value;
								var divId = Cmn.GetAncestorByClsNm(otherInpBxs[i], "SpecSrch_Attribute").id;
								var attrIdArray = divId.split("_")
								attrnms[attrnms.length] = attrIdArray[PUB_ATTR_ID_IDX];
							}
						}
					} else {
					//get attribute names and values for old style attributes
						var attrCntnrs = Cmn.GetChldrnBy(function (elem) { return Cmn.HasCls(elem, "InLnOrdWebPart_ChildAttrCntnr") }, attrCntnr)
						  , inpBx = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_AttrInpBx", "input", attrCntnr)[0]
						  , attrCntnrMetaDat = attrCntnr.attributes
						  , partNbrSeq = 0;
					  
						// Collect the attribute names and values.
						for (var cntnrIdx = 0; cntnrIdx < attrCntnrs.length; cntnrIdx++) {
							var attrSlct = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrDropDwn", "div", attrCntnrs[cntnrIdx])[0]
								  , attrLst = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrForm", "ul", attrCntnrs[cntnrIdx])[0];

							//get sequence number from the attribute container. 
							//this sequence number is used to uniquely identify each instance of same part number 
							for (var i=0; i<attrCntnrMetaDat.length; i++){
								if (attrCntnrMetaDat[i].name == "data-mcm-partnbr-seqnbr"){
									partNbrSeq = attrCntnrMetaDat[i].value;
									break;
								}
							}
							
							if (attrSlct) {
								var id = attrSlct.id;
								if (partNbrSeq && partNbrSeq > 0){
									id = id + partNbrSeq;
								}
								
								if (mAttrbtSlctdTbl.Itm(id)) {
									attrnms[cntnrIdx] = attrSlct.id.split('&')[IDSTRARR_ATTRNAME_INDEX];
									attrvals[cntnrIdx] = getAttrVal(mAttrbtSlctdTbl.Itm(id));
									var attrSlctsInnerHTML = attrSlct.innerHTML;
									if (attrvals[cntnrIdx] == "Other") {
										if (inpBx.value.length > 0) {
											//save what the user has typed to transfer to item presentation
											inpBxVal = inpBx.value;
										}
									} else if (attrSlctsInnerHTML == 'Select from list...') {
										attrvals[cntnrIdx] = "Select from list...";
									}
								}
								else {
									// do nothing
								}
							} else if (attrLst) {
								
								var slctAttrRdoBtn = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrLstSlctd", "li", attrLst)[0];
								if (slctAttrRdoBtn) {
									attrnms[cntnrIdx] = attrLst.id;
									attrvals[cntnrIdx] = getAttrVal(slctAttrRdoBtn.innerHTML);
								} else {
									// do nothing
								}
							}
						}
					}
					
					// Join the attribute names and values into a query string
					// delimited by the proper character.
					if (attrnms && attrvals) {
						attrNms = attrnms.join(String.fromCharCode(2029));
						attrValsTxt = attrvals.join(String.fromCharCode(2029));
					}
				}
			}
			
			//Publish product link clicked message
			var newMsgHdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.ITM_PRSNTTN);
			McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.ProdDtlLnkClicked(newMsgHdr, partNbrTxt, usrInp, attrCompItmIds, attrNms, attrValsTxt, inpBxVal, qtyInpBxVal));    
			
		}
    };

	
    // <summary>
    // Remove from cache
    // </summary>
    Me.RemFrmCache = function (partNbrTxt) {
        // Set the global variables associated with the javascript objects.
        if (typeof (mCrtedBxObjs) == "object") {
            // Session inexplicably clones arrays incorrectly when we're
            // in iFrames. Recast the (now) object back to an array.
            for (var i = 0; i < mCrtedBxObjs.length; i++) {
                if (mCrtedBxObjs[i].PartNbrTxt == partNbrTxt) {
                    mCrtedBxObjs.splice(i, 1);
                }
            }
        }
    };

    // <summary>
    // Redirects the customer to additional content such as MSDS pages 
    // or product specification sheets depending on what content is available. 
    // </summary>
    // <param name="typeTxt">The type of additional content document.</param>
    // <param name="idTxt"The id of the document requrested.></param>
    // <param name="partNbrTxt"The part number text.></param>
    Me.AddCntLnk_Click = function (typeTxt, idTxt, partNbrTxt) {
        // Create url
        var url = "/addlcontent/loadaddcontent.asp?ID=" + idTxt + "&Type=" + typeTxt;

        // Load url into MainIFrame
        McMasterCom.LoadMgr.LoadMainIFrame(url);

        // Webreports tracking.
        Cmn.TrkAct("InLnOrdAddCntClck&partnbr=" + partNbrTxt, "InLnOrd");
		
		// TrkSrch
        var srchTrkInfo = new SrchTrkr.SrchDat({ usr: SrchTrkr.UsrActTyps.SLCT });
        srchTrkInfo.usr.srcNm = "InLnOrdWebPart";
        srchTrkInfo.usr.slctdNm = partNbrTxt;
        srchTrkInfo.usr.elemTyp = SrchTrkr.ElemTyps.ADDNL_CNTNT_LNK;
        srchTrkInfo.Trk();
    };

    Me.CtlgPageOptOut_Click = function (e, partNbrTxt, ctlgPgNbr) {
        /// <summary>
        /// Redirects the customer to the selected product's catalog page.
        /// </summary>
        /// <param name="e"> The link clicked.</param>
        /// <param name="partNbrTxt"The part number text.></param>
        /// <param name="ctlgPgNbr">The catalog page number.</param>

        // Set the state value in session for the selected part number. 
        setVal(valDefs.ActvInLnOrdBx.KyTxt(), mBxObj);
        setVal(valDefs.InLnOrdBxsCrtd.KyTxt(), mCrtedBxObjs);
        setVal(valDefs.SlctdPartNbrTxt.KyTxt(), mBxObj.PartNbrTxt);

        if (partNbrTxt) {
            // Create a page number search message. 
            var msgHdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.SRCH_ENTRY_WEB_PART)
			 , partNbrSlctdMsg = new McMaster.MsgMgrMsgs.PartNbrSlctd(msgHdr, partNbrTxt);

            // Publish the catalog page selected message. 
            McMaster.MsgMgr.PubMsg(partNbrSlctdMsg);

            // Webreports tracking.
            Cmn.TrkAct("InLnOrdCatPage&partnbr=" + partNbrTxt, "InLnOrd");
        } else {
            // Create a catalog page message
            var msgHdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.INLN_ORD)
				  , ctlgPgSlctdMsg = new McMaster.MsgMgrMsgs.CtlgPageSlctd(msgHdr, ctlgPgNbr);
            setVal(valDefs.CurrCtlgPgNbr.KyTxt(), ctlgPgNbr);

            //Publish the catalog page selected message
            McMaster.MsgMgr.PubMsg(ctlgPgSlctdMsg);
        }

        // TrkSrch
        var srchTrkInfo = new SrchTrkr.SrchDat({ usr: SrchTrkr.UsrActTyps.SLCT });
        srchTrkInfo.usr.srcNm = "InLnOrdWebPart";
        srchTrkInfo.usr.slctdNm = partNbrTxt ? partNbrTxt : ctlgPgNbr;
        srchTrkInfo.usr.elemTyp = partNbrTxt ? SrchTrkr.ElemTyps.PART_NBR_CTLG_PG : SrchTrkr.ElemTyps.CTLG_PG;
        srchTrkInfo.Trk();
    };

    Me.BmLnk_Click = function (bmLnk, partNbrTxt) {
        /// <summary>
        /// Bookmarks the current product. 
        /// <param name="bmLnk"The bookmark link.></param>
        /// <param name="partNbrTxt"The part number text.></param>
        /// </summary>

        // Switch bookmark link to bookmarked text.
        var bkmkSpn = Cmn.GetNxtSiblingBy(bmLnk, function (elem) { return Cmn.HasCls(elem, "InLnOrdWebPart_Bkmkd") });
        Cmn.AddCls(bmLnk, "Hide");
        Cmn.RemCls(bkmkSpn, "Hide");

        // Grab hidden bookmark form and submit.
        var lnkCntnr = Cmn.GetAncestorByTagNm(bmLnk, "div")
			  , objFrm = Cmn.GetNxtSiblingBy(lnkCntnr, function (elem) { return Cmn.HasCls(elem, "InLnOrdWebPart_BmForm") });
        objFrm.submit();

        // Publish message to load left side bookmarks frame
        var hdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.INLN_ORD)
			  , msg = new McMaster.MsgMgrMsgs.BMsSlctd(hdr);
        McMaster.MsgMgr.PubMsg(msg);

        // Webreports tracking.
        Cmn.TrkAct("InLnOrdBmClck&partnbr=" + partNbrTxt, "InLnOrd");

        // TrkSrch
        var srchTrkInfo = new SrchTrkr.SrchDat({ usr: SrchTrkr.UsrActTyps.SLCT });
        srchTrkInfo.usr.srcNm = "InLnOrdWebPart";
		srchTrkInfo.usr.elemTyp = SrchTrkr.ElemTyps.BOOKMARK;
        srchTrkInfo.usr.slctdNm = decodeURIComponent(partNbrTxt);
        srchTrkInfo.Trk();
    };

    Me.AttrLstChng = function (e, partNbrTxt) {
        /// <summary>
        /// Update the new attribute from the option links.
        /// </summary>
        /// <param name="e">
        /// The list item selected
        /// </param>	
        /// <param name="partNbrTxt">
        /// The the part number associated with the menu adjusted
        /// </param>	

        // Set slctd class and remove the slctd class from other option
        var attrCntnr = Cmn.GetAncestorByClsNm(e, "InLnOrdWebPartAttrCntnr")
			  , attrLstCntnr = Cmn.GetAncestorByClsNm(e, "InLnOrdWebPart_ChildAttrCntnr")
			  , attrLiElems = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrLst", "li", attrLstCntnr);

        if (Cmn.HasCls(e, "InLnOrdWebPart_AttrLstSlctd")) {

            // If clicked link was already selected, then unselect the attribute and 
            // show the hidden options.
            for (var lstIdx = 0; lstIdx < attrLiElems.length; lstIdx++) {
                Cmn.RemCls(attrLiElems[lstIdx], "Hide");
            }

            // Remove the selected class on the list element. 
            Cmn.ReplaceCls(e, "InLnOrdWebPart_AttrLstSlctd", "InLnOrdWebPart_AttrLst");

            // Clear out the stock message, since no attribute option has been selected.
            var stkmsgcntnr = Cmn.Get("InLnOrdWebPart_StkMsg" + partNbrTxt);
            if (stkmsgcntnr) {
                stkmsgcntnr.innerHTML = "";
            }

            // Clear the CAD link, since no attribute option has been selected.
            var lnkCntnr = Cmn.Get("InLnOrdWebPart_Lnks" + partNbrTxt);
            var addnlCntntLnkCntnr = Cmn.GetElementBy(function (elem) { return Cmn.HasCls(elem, "MsdsSpan") }, 'span', lnkCntnr);
            if (addnlCntntLnkCntnr) {
                addnlCntntLnkCntnr.innerHTML = "";
            }

            // Clear the product spec link, since no attribute option has been selected.
            var mainCntCntnr = Cmn.GetNxtSiblingBy(lnkCntnr, function (elem) { return Cmn.HasCls(elem, "InLnOrdWebPartLayout_Main") });
            var prodSpecCntnrs = Cmn.GetElementsByClsNm("InLnOrdWebPart_ProdSpecLnk", "div", mainCntCntnr);
            if (prodSpecCntnrs) {
                prodSpecCntnrs.innerHTML = "";
            }
			
			
			// Update the item information for the selected attribute value.
            updtAttr(e);

        } else {
            // Hide the "Please complete the specification..." error if it is displayed
            var attrAlertCntnrs = Cmn.GetElementsBy(function (elem) { return Cmn.HasCls(elem, "InLnOrdWebPart_AttrAlert"); }, 'div', attrCntnr);

            for (var alertCntnrIDx = 0; alertCntnrIDx < attrAlertCntnrs.length; alertCntnrIDx++) {
                Cmn.ReplaceCls(attrAlertCntnrs[alertCntnrIDx], "Show", "Hide");
            }

            // Option was selected so hide other values and set proper identifier class				
            Cmn.ReplaceCls(e, "InLnOrdWebPart_AttrLst", "InLnOrdWebPart_AttrLstSlctd");

            for (var lstIdx = 0; lstIdx < attrLiElems.length; lstIdx++) {
                if (Cmn.HasCls(attrLiElems[lstIdx], "InLnOrdWebPart_AttrLst")) {
                    Cmn.AddCls(attrLiElems[lstIdx], "Hide");
                } else {
                    // Do nothing.
                }
            }

            // Update the item information for the selected attribute value.
            updtAttr(e);
        }

        // Hide the error message
        var attrAlertCntnrs = Cmn.GetElementsBy(function (elem) { return Cmn.HasCls(elem, "InLnOrdWebPart_AttrAlert"); }, 'div', attrCntnr);
        for (var alertCntnrIDx = 0; alertCntnrIDx < attrAlertCntnrs.length; alertCntnrIDx++) {
            Cmn.ReplaceCls(attrAlertCntnrs[alertCntnrIDx], "Show", "Hide");
        }
    };

    Me.InpBxKeyUp = function (evnt, e, partNbrTxt) {
        /// <summary>
        /// Checks the key press from the input box for enters and 
        /// calls the add to order function if so.
        /// </summary>
        /// <param name="evnt"> The key up event on the input quantity box. </param>
        /// <param name="e"> The input quantity box. </param>
        /// <param name="partNbrTxt"The part number text.></param>

		if (evnt.keyCode == ENT_KY_CD && e.value.length >= 0) {
			Me.AddToOrd_Click(e);
		} else {
			var bx = Cmn.GetAncestorByClsNm(e, "InLnOrdWebPartLayout_CntntDiv");	
			var testMthd = function(elem) {
				if (elem.id == "InLnOrdWebPartQtyErr" + partNbrTxt
					&& Cmn.HasCls(elem, "InLnOrdWebPartLayout_QtyErr")){
				    return true;
				}
			}
			
			var qtyErrCntnr = Cmn.GetElementBy(testMthd, 'div', bx);
			if (e.value.length >= 0) {
				Cmn.ReplaceCls(qtyErrCntnr, "Show", "Hide");
			}
		}
	};

    // <summary>
    // Adds the selected product to the user's order. 
    // </summary>
    // <param name="e">The click event on the add to order button.</param>
    Me.AddToOrd_Click = function (btn) {
		
        var mainCntnr = Cmn.GetAncestorByClsNm(btn, "InLnOrdWebPartLayout_Main");
        if (!mainCntnr) {
            mainCntnr = mBxObj.MainCntnr;
        }

        var cntntRow = Cmn.GetAncestorByTagNm(mainCntnr, "tr");
        var parentRow = Cmn.GetPrevSibling(Cmn.GetPrevSibling(cntntRow));
        var partNbrCells = Cmn.GetChildrenByClsNm(parentRow, "ItmTblCellPartNbr");
        var partNbrLnk = null;
        for (var i = 0; i < partNbrCells.length; i++) {
            if (!Cmn.HasCls(partNbrCells[i], "ItmTblFiller")) {
                partNbrLnks = Cmn.GetChildrenByClsNm(partNbrCells[i], "PartNbrSlctd");
                if (partNbrLnks.length == 0) {
                    partNbrLnks = Cmn.GetChildrenByClsNm(partNbrCells[i], "AddToOrdBxCreated");
                }
                if (partNbrLnks.length > 0) {
                    partNbrLnk = partNbrLnks[0];
                    break;
                }
            }
        }

        // Reset the box object if necessary. 
        // We have to check for this in case the user had more than one box open and chose
        // to add an item from an "inactive" box. 
        Me.ResetBxObj(btn, parentRow);
        // Proceed with add to order functionality. 
        var qtyErrCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_QtyErr", "div", mainCntnr)[0]
              , attrWarningCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_WarningAlert", "div", mainCntnr)[0]
			  , attrSlctCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartAttrCntnr", "div", mainCntnr)[0]
			  , attrAlertCntnr
			  , attrSlcts
			  , attrnms = []
			  , attrvals = []
			  , attrNmsQSTxt
			  , attrValsQSTxt
			  , addtoOrdBxCntnr
			  , inpQtyBxCntnr
			  , inpBx
			  , specItm = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_ItmSpecTxtBx", "textarea", mainCntnr)[0]
			  , availLensQSTxt = mMetaDat.AttrMstrAvailLens.join(String.fromCharCode(2029))
			  , specItmTxt = ""
			  , qtyTxt
			  , attrMissingInd = false
			  , missingAttrNm
			  , attrCntnrs
			  , otherInpBx
			  , attrAlertHiddenInd = false
			  , isInLnSpecInd = isInLnSpec(partNbrLnk)
			  , qtyErrIsShowing = false
			  , attrErrIsShowing = false
			  , attrCntnrMetaDat
			  , seqNbr = 0
		
		if (isInLnSpecInd) {
		//new flow
            		
			//Other input box logic.
			var otherInpBxs = Cmn.GetElementsByClsNm("OtherValInpBx", "input", mBxObj.MainCntnr);
			var sizedInpBx = Cmn.GetElementsByClsNm("SizedInpBx","textarea",mBxObj.MainCntnr)[0];
			
			//populate attrvals and attrnms
			if (otherInpBxs) {
				for (var i = 0; i < otherInpBxs.length; i++) {
					attrvals[attrvals.length] = otherInpBxs[i].value;
					var divId = Cmn.GetAncestorByClsNm(otherInpBxs[i], "SpecSrch_Attribute").id;
					var attrIdArray = divId.split("_")
					attrnms[attrnms.length] = attrIdArray[PUB_ATTR_ID_IDX];
				}
			}
			
			if (sizedInpBx) {		
				//remove traces of wrapping implementation i.e. non-printed characters
				sizedInpBx.value = replaceAllSubstr(ZERO_WIDTH_SPACE + ZERO_WIDTH_SPACE + "\n",ZERO_WIDTH_SPACE + "\n",sizedInpBx.value);
				sizedInpBx.value = replaceAllSubstr(ZERO_WIDTH_SPACE + "\n","\n",sizedInpBx.value);
				attrvals[attrvals.length] = sizedInpBx.value;
				var divId = Cmn.GetAncestorByClsNm(sizedInpBx, "SpecSrch_Attribute").id;
				var attrIdArray = divId.split("_");
				attrnms[attrnms.length] = attrIdArray[PUB_ATTR_ID_IDX];
			}		

			// Join the attribute names and values into a query string
			// delimited by the proper character.
			if (attrnms && attrvals) {
				attrNmsQSTxt = attrnms.join(String.fromCharCode(2029));
				attrValsQSTxt = attrvals.join(String.fromCharCode(2029));
			}
			
			// Grab the quantity to add to the order from the input box
			if (Cmn.HasCls(btn, "InLnOrdWebPartLayout_InpBx")) {
				inpBx = btn;
			} else {
				addtoOrdBxCntnr = Cmn.GetAncestorByClsNm(btn, "InLnOrdWebPartLayout_AddtoOrd");
				inpQtyBxCntnr = Cmn.GetPrevSibling(addtoOrdBxCntnr);
				inpBx = Cmn.GetFrstChld(inpQtyBxCntnr);
			}

			qtyTxt = inpBx.value;
			// If the value entered is 0, set the qtyTxt to spaces.
			if (parseFloat(qtyTxt) == 0) {
				qtyTxt = "";
			}
			
			//If the quantity error is showing, set the qtyErrIsShowing indicator to true.
			//Pauses the add to order flow.
			if (qtyErrCntnr && qtyErrCntnr.innerHTML.length > 0) {
				qtyErrIsShowing = true;
			}
			
			//We consider the existence of warning message text as a suggestion.
			//When the customer clicks add to order, it becomes bold and we then consider it a warning.
			//This is when the attrErr is considered to be showing, which pauses the add to order flow.
			if (attrWarningCntnr && attrWarningCntnr.innerHTML.length > 0) {
				if (Cmn.HasCls(attrWarningCntnr, "InLnOrdWebPartLayout_BoldedWarningAlert")) {
					attrErrIsShowing = true;
				}
			}
			
			var cnxnObj = {
				success: hndlAddToOrdAJAXResp,
				failure: hndlFailedAddToOrdAjaxResp,
				cnxnParm: {
					respTyp: McMaster.CnxnMgr.WEB_PART_RESP_TYP_TXT,
					PartNbrTxt: partNbrLnk.innerHTML,
					mainCntnr: mainCntnr, 
					isInLnSpecInd: isInLnSpecInd
				}
			};

			var url = INLN_ORD_HTTP_HANDLER_URL + "?" +
							ACT_TXT + "=" +
							ADD_ITM_CURR_ORD_QS_KY_TXT + "&" +
							PART_NBR_QS_KY_TXT + "=" +
							partNbrLnk.innerHTML + "&" +
							QTY_TXT_QS_KY_TXT + "=" +
							encodeURIComponent(qtyTxt) + "&" +
							ATTR_NM_QS_KY_TXT + "=" +
							encodeURIComponent(attrNmsQSTxt) + "&" +
							ATTR_VAL_QS_KY_TXT + "=" +
							encodeURIComponent(attrValsQSTxt) + "&" +
							SPEC_ITM_QS_KY_TXT + "=" +
							encodeURIComponent(specItmTxt) + "&" +
							ATTR_MSTR_AVAIL_LENS + "=" +
							availLensQSTxt + "&" +
							FIRM_PKG_ERR_IND + "=" +
							"false&" +
							QTY_ERR_SHOWING_IND + "=" +
							qtyErrIsShowing + "&" +
							ATTR_ERR_SHOWING_IND + "=" +
							attrErrIsShowing;

			var attrCompItmIds = partNbrLnk.getAttribute("data-mcm-attr-comp-itm-ids");
			var fullPrsnttnId = getFullPrsnttnId(partNbrLnk);
			var prsnttnId = getPrsnttnId(partNbrLnk); //part number link may exist in either sub or full

			url = url + "&" +
				  FULL_PRSNTTN_ID_KY_TXT + "=" +
				  fullPrsnttnId + "&" +
				  PRSNTTN_ID_KY_TXT + "=" +
				  prsnttnId + "&" +
				  IS_INLNSPEC + "=" +
				  true + "&" +
				  ATTR_COMP_IDS + "=" +
				  attrCompItmIds;

			var inLnSpecInpDict = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.InLnSpecUsrInps.KyTxt());
			seqNbr = partNbrLnk.getAttribute("data-mcm-partnbr-seqnbr");
			if (inLnSpecInpDict) {
				var inLnSpecId = partNbrLnk.innerHTML + '_' + prsnttnId;
				if (seqNbr){
					inLnSpecId = inLnSpecId + '_' + seqNbr;
				}
				if (inLnSpecId in inLnSpecInpDict) {
					url = inLnSpecInpDict[inLnSpecId].AddSpecUsrInpQS(url);
				}
			}
			
			// Use Connection Manager to call the web part's HTTP handler.
			McMaster.CnxnMgr.PerformAjaxCnxn(url, cnxnObj);
			
			Cmn.AddCls(mBxObj.PartNbrLnk, "AddToOrdBxOrdered");
			Cmn.AddCls(partNbrLnk, "AddToOrdBxOrdered");
			

		} else {
		//old flow

			if (attrSlctCntnr) {
				attrCntnrs = Cmn.GetElementsByClsNm("InLnOrdWebPart_ChildAttrCntnr", "div", attrSlctCntnr);
				otherInpBx = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_AttrInpBx", "input", attrSlctCntnr)[0];
				attrAlertCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrAlert", "div", attrSlctCntnr);
				attrSlcts = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrDropDwn", "div", attrSlctCntnr);
				attrLists = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrForm", "ul", attrSlctCntnr);
				attrCntnrMetaDat = attrSlctCntnr.attributes;
				//get sequence number from the attribute container. 
				//this sequence number is used to uniquely identify each instance of same part number 
				for (var i = 0; i < attrCntnrMetaDat.length; i++) {
					if (attrCntnrMetaDat[i].name == "data-mcm-partnbr-seqnbr") {
						seqNbr = attrCntnrMetaDat[i].value;
						break;
					}
				}

				// Check the attribute drop-down menus 
				// and make sure that options have been selected.						
				for (var cntnrIdx = 0; cntnrIdx < attrCntnrs.length; cntnrIdx++) {
					var attrSlct = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrDropDwn", "div", attrCntnrs[cntnrIdx])[0];
					var attrLst = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrForm", "ul", attrCntnrs[cntnrIdx])[0];
					if (attrSlct) {
						attrnms[cntnrIdx] = attrSlct.id.split('&')[IDSTRARR_ATTRNAME_INDEX];
						
						var id = attrSlct.id;
						if (seqNbr && seqNbr > 0) {
							id = id + seqNbr;
						}
						if (mAttrbtSlctdTbl.Itm(id)) {
							attrvals[cntnrIdx] = getAttrVal(mAttrbtSlctdTbl.Itm(id));
							var attrSlctInnerHTML = attrSlct.innerHTML;
							if (attrvals[cntnrIdx] == "Other") {
								attrvals[cntnrIdx] = otherInpBx.value;
							} else if (attrSlctInnerHTML == 'Select from list...') {
								// If no option is selected, set the missing attribute indicator to true
								attrMissingInd = true;
								mAttrErrInd = false;
								attrvals[cntnrIdx] = " ";
								missingAttrNm = id;
							}
						}
						else {
							// If no option is selected, set the missing attribute indicator to true
							attrMissingInd = true;
							mAttrErrInd = false;
							attrvals[cntnrIdx] = " ";
						}


					} else if (attrLst) {
						attrnms[cntnrIdx] = attrLst.id;
						var slctAttrRdoBtn = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrLstSlctd", "li", attrLst)[0];
						if (slctAttrRdoBtn) {
							attrvals[cntnrIdx] = getAttrVal(slctAttrRdoBtn.id);
						} else {
							// If no option is selected, set the missing attribute indicator to true
							attrMissingInd = true;
							mAttrErrInd = false;
							attrvals[cntnrIdx] = " ";
							missingAttrNm = attrnms[cntnrIdx];
						}
					}
				}
			}

			// this is a HACK. INLNORDering treats spec items and attributed items with custom attribute
			// rendering logic searches for custom* and creates a spec box
			// before change, here we used to rely on presence of spec box to determine if it is a spec item
			// NOW, we assume that if it is not spec item (isSpecInd = false) then it is a custom item 
			// even if a spec box is present.
			// there are other ways of doing it, such as relying on mBoxObj to supply info about what is being added to order
			// , intead of relying on HTML

			if (specItm) {
				if (mBxObj.PartNbrMetaDat.IsSpecInd) {
					specItmTxt = specItm.value;
				} else if (specItm) {
					// this is a custom* attribute
					attrnms[attrnms.length] = "Custom"
					attrvals[attrvals.length] = specItm.value;
				}
			}
			
			if (attrnms && attrvals) {
				attrNmsQSTxt = attrnms.join(String.fromCharCode(2029));
				attrValsQSTxt = attrvals.join(String.fromCharCode(2029));
			}
				
			// Grab the quantity to add to the order from the input box
			if (Cmn.HasCls(btn, "InLnOrdWebPartLayout_InpBx")) {
				inpBx = btn;
			} else {
				addtoOrdBxCntnr = Cmn.GetAncestorByClsNm(btn, "InLnOrdWebPartLayout_AddtoOrd");
				inpQtyBxCntnr = Cmn.GetPrevSibling(addtoOrdBxCntnr);
				inpBx = Cmn.GetFrstChld(inpQtyBxCntnr);
			}

			qtyTxt = inpBx.value;
			// If the value entered is 0, set the qtyTxt to spaces.
			if (parseFloat(qtyTxt) == 0) {
				qtyTxt = "";
			}
			
			//If the quantity error is showing, set the qtyErrIsShowing indicator to true.
			//Pauses the add to order flow.
			if (qtyErrCntnr && qtyErrCntnr.innerHTML.length > 0) {
				qtyErrIsShowing = true;
			}
			
			// Set the attribute alert container indicator. 
			if (attrAlertCntnr) {
				if (Cmn.HasCls(attrAlertCntnr[0], "Hide")) {
					attrAlertHiddenInd = true;
				} else {
					attrErrIsShowing = true;
				}
			}

			// Check for missing attribute or quantites before setting up the 
			// AJAX call to add item to the order.  If error message has already
			// been shown, go ahead and add to the item to the order as is.
			if (attrMissingInd && attrAlertHiddenInd && mAttrErrInd == false) {

				Cmn.ReplaceCls(attrAlertCntnr[0], "Hide", "Show");
				InLnOrdWebPart.ScrollToShowInLnOrdCntnr();
				Cmn.TrkAct("InLnOrdAttrErr&partnbr=" + partNbrLnk.innerHTML, "InLnOrd");

				// Set the global attribute missing indicator to true. We only want the
				// customer to see this warning once. 
				if (chkAvailLensDsc(qtyTxt) == false) {
					// Do nothing. The user has an available lengths violation
					// so don't allow them to add the item to the order next time.
				} else {
					mAttrErrInd = true;
				}
			} else if (qtyTxt.length == 0 && Cmn.HasCls(qtyErrCntnr, "Hide")) {
				// The customer did not enter a quantity or entered "0" as a quantity. 
				qtyErrCntnr.innerHTML = "Please enter a quantity.";
				Cmn.ReplaceCls(qtyErrCntnr, "Hide", "Show");
				inpBx.focus();
				InLnOrdWebPart.ScrollToShowInLnOrdCntnr();
				Cmn.TrkAct("InLnOrdQtyErr&partnbr=" + partNbrLnk.innerHTML, "InLnOrd");
			} else if (mBxObj.PartNbrMetaDat.IsFirmPkgInd && (qtyTxt.indexOf("-") > -1 || qtyTxt.indexOf("/") > -1) && Cmn.HasCls(qtyErrCntnr, "Hide")) {
				// This item is sold in a firm package and the customer entered a value that contains
				// a "-" or a "/". We need to send that information to the server for parsing. 

				// Indicator to determine if an ajax call has already been made; will become
				// true once the success method has been executed. Prevents an item from being 
				// added multiple times if the add to order button is clicked quickly.
				mReadyNxtAjaxCallInd = false;

				var cnxnObj = {
					success: hndlAddToOrdAJAXResp,
					failure: hndlFailedAddToOrdAjaxResp,
					cnxnParm: {
						respTyp: McMaster.CnxnMgr.WEB_PART_RESP_TYP_TXT,
						PartNbrTxt: partNbrLnk.innerHTML,
						mainCntnr: mainCntnr,
						isInLnSpecInd: isInLnSpecInd
					}
				};

				var url = INLN_ORD_HTTP_HANDLER_URL + "?" +
								ACT_TXT + "=" +
								ADD_ITM_CURR_ORD_QS_KY_TXT + "&" +
								PART_NBR_QS_KY_TXT + "=" +
								mBxObj.PartNbrTxt + "&" +
								QTY_TXT_QS_KY_TXT + "=" +
								encodeURIComponent(qtyTxt) + "&" +
								ATTR_NM_QS_KY_TXT + "=" +
								encodeURIComponent(attrNmsQSTxt) + "&" +
								ATTR_VAL_QS_KY_TXT + "=" +
								encodeURIComponent(attrValsQSTxt) + "&" +
								SPEC_ITM_QS_KY_TXT + "=" +
								encodeURIComponent(specItmTxt) + "&" +
								ATTR_MSTR_AVAIL_LENS + "=" +
								availLensQSTxt + "&" +
								FIRM_PKG_ERR_IND + "=" +
								!Cmn.HasCls(qtyErrCntnr, "Hide") + "&" +
								QTY_ERR_SHOWING_IND + "=" +
								qtyErrIsShowing + "&" +
								ATTR_ERR_SHOWING_IND + "=" +
								attrErrIsShowing;

				// Use Connection Manager to call the web part's HTTP handler.
				McMaster.CnxnMgr.PerformAjaxCnxn(url, cnxnObj);
			} else if (mBxObj.PartNbrMetaDat.IsFirmPkgInd && (parseFloat(qtyTxt) % 1 > 0) && Cmn.HasCls(qtyErrCntnr, "Hide")) {
				// This item is sold in a firm package and the customer entered a quantity
				// that breaks the package. Show an error message.
				qtyErrCntnr.innerHTML = "This product is sold in packs of " + mMetaDat.SellStdPkgQty + ".";
				Cmn.ReplaceCls(qtyErrCntnr, "Hide", "Show");
				inpBx.select();
				InLnOrdWebPart.ScrollToShowInLnOrdCntnr();
				Cmn.TrkAct("InLnOrdFirmPkgErr&partnbr=" + partNbrLnk.innerHTML, "InLnOrd");

			} else if (mReadyNxtAjaxCallInd) {

				// Indicator to determine if an ajax call has already been made; will become
				// true once the success method has been executed. Prevents an item from being 
				// added multiple times if the add to order button is clicked quickly.
				mReadyNxtAjaxCallInd = false;

				var cnxnObj = {
					success: hndlAddToOrdAJAXResp,
					failure: hndlFailedAddToOrdAjaxResp,
					cnxnParm: {
						respTyp: McMaster.CnxnMgr.WEB_PART_RESP_TYP_TXT,
						PartNbrTxt: partNbrLnk.innerHTML,
						mainCntnr: mainCntnr,
						isInLnSpecInd: isInLnSpecInd
					}
				};

				var url = INLN_ORD_HTTP_HANDLER_URL + "?" +
								ACT_TXT + "=" +
								ADD_ITM_CURR_ORD_QS_KY_TXT + "&" +
								PART_NBR_QS_KY_TXT + "=" +
								partNbrLnk.innerHTML + "&" +
								QTY_TXT_QS_KY_TXT + "=" +
								encodeURIComponent(qtyTxt) + "&" +
								ATTR_NM_QS_KY_TXT + "=" +
								encodeURIComponent(attrNmsQSTxt) + "&" +
								ATTR_VAL_QS_KY_TXT + "=" +
								encodeURIComponent(attrValsQSTxt) + "&" +
								SPEC_ITM_QS_KY_TXT + "=" +
								encodeURIComponent(specItmTxt) + "&" +
								ATTR_MSTR_AVAIL_LENS + "=" +
								availLensQSTxt + "&" +
								FIRM_PKG_ERR_IND + "=" +
								!Cmn.HasCls(qtyErrCntnr, "Hide") + "&" + 
								QTY_ERR_SHOWING_IND + "=" +
								qtyErrIsShowing + "&" +
								ATTR_ERR_SHOWING_IND + "=" +
								attrErrIsShowing;

				// Use Connection Manager to call the web part's HTTP handler.
				McMaster.CnxnMgr.PerformAjaxCnxn(url, cnxnObj);
			}

			Cmn.AddCls(mBxObj.PartNbrLnk, "AddToOrdBxOrdered");
			Cmn.AddCls(partNbrLnk, "AddToOrdBxOrdered");
		}

    };

    Me.OrdLnk_Click = function () {
        /// <summary>
        /// Makes sure that the order pad loads in the correct frame when the user
        /// clicks on the "order" link from the confirmation message.
        /// </summary>
        /// <remarks>
        /// The call to this function resides in markup generated by the add to order
        /// function in mcmWebOrdLnWrapper. 
        /// </remarks>
        var mcmTop = McMasterCom.Nav.GetTopFrame(self);

        mcmTop.location.href = "/#orders";
    }

    // <summary>
    // Closes the add to order box. Executed either when the user clicks on the
    // part number link a second time or clicks on the close icon. 
    // </summary>
    // <param name="btn">The button on which the user clicked to close the box.</param>
    Me.CloseBx = function (btn) {
        var partNbrLnks = Cmn.GetElementsByClsNm("PartNbrLnk", "a"),
			inlnOrdContentCell = Cmn.GetAncestorByTagNm(btn, "td"),
			inlnOrdContentRw = Cmn.GetAncestorByTagNm(btn, "tr"),
			inLnOrdHdrRow = Cmn.GetPrevSibling(inlnOrdContentRw),
			partNbrTxt = null,
			partNbrLnk = null,
			seqNbr = btn.getAttribute("data-mcm-partnbr-seqnbr");

        if (inlnOrdContentCell) {
            var chld = inlnOrdContentCell.childNodes[0];
            if (chld && Cmn.HasCls(chld, "InLnOrdWebPartLayout_CntntDiv")) {
                var inlnOrdElemCntnr = chld.childNodes[0];
                if (inlnOrdElemCntnr && Cmn.HasCls(inlnOrdElemCntnr, "InLnOrdWebPart_RacingStripe")) {
                    var inlnElems = inlnOrdElemCntnr.childNodes;
                    for (var i = 0; i < inlnElems.length; i++) {
                        if (Cmn.HasCls(inlnElems[i], "InLnOrdWebPartLayout_Lnks")) {
                            partNbrTxt = inlnElems[i].id.replace("InLnOrdWebPart_Lnks", "");
                            break;
                        }
                    }
                }
            }

			if (partNbrTxt == null) {
				var lastIdx = inlnOrdContentCell.id.split("_").length - 1;
				partNbrTxt = inlnOrdContentCell.id.split("_")[lastIdx];
			}

			if (partNbrTxt) {
				for (var i = 0; i < partNbrLnks.length; i++) {
					if (partNbrLnks[i].innerHTML == partNbrTxt && Cmn.HasCls(partNbrLnks[i], "AddToOrdBxCreated")) {
						var seqNbrOnPartNbrLnk = partNbrLnks[i].getAttribute("data-mcm-partnbr-seqnbr");
						if (seqNbr){
							if (seqNbrOnPartNbrLnk && seqNbrOnPartNbrLnk == seqNbr){
								partNbrLnk = partNbrLnks[i];
								break;
							}
						}else{
							if (seqNbrOnPartNbrLnk) {
								//do nothing	
							}else{
								partNbrLnk = partNbrLnks[i];
								break;	
							}
						}
					}
				}
			}
		}

        if (partNbrLnk) {
            //hide inline order box
            InLnOrdWebPart.HideInLnBx(inLnOrdHdrRow, inlnOrdContentRw, Cmn.GetAncestorByTagNm(partNbrLnk, "td"), true);
        }
		
		// TrkSrch
		var srchTrkInfo = new SrchTrkr.SrchDat({ usr: SrchTrkr.UsrActTyps.SLCT });
		srchTrkInfo.usr.srcNm = "InLnOrdWebPart";
		srchTrkInfo.usr.elemTyp = SrchTrkr.ElemTyps.CLOSE_BTN;
		srchTrkInfo.usr.slctdNm = decodeURIComponent(partNbrTxt);
		srchTrkInfo.Trk();

        // Publish the inline order box closed message 
        var inlnOrdBxClosMsgHdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.FULL_PRSNTTN)
		  , inlnOrdBxClosMsg = new McMaster.MsgMgrMsgs.InlnOrdBxClosed(inlnOrdBxClosMsgHdr);
        McMaster.MsgMgr.PubMsg(inlnOrdBxClosMsg);
    }

    Me.MouseOver = function (e) {
        /// <summary>
        /// Handles mouseover of attribute to highlight the element.
        /// </summary>
        /// <param name="e"> The element clicked.</param>
        Cmn.AddCls(e, "InLnOrdWebPartLayout_AttrHighlight");
    }

    Me.MouseOverCloseBtn = function (e) {
        /// <summary>
        /// Handles mouseover of Close button to change color to black.
        /// </summary>
        /// <param name="e"> The element clicked.</param>
        Cmn.ReplaceCls(e, "InLnOrdWebPartLayout_CloseIconGreyImg", "InLnOrdWebPartLayout_CloseIconBlackImg");
    }

    Me.MouseOverAddToOrdBtn = function (e) {
        /// <summary>
        /// Handles mouseover of Add to Order button to change color to black.
        /// </summary>
        /// <param name="e"> The element clicked.</param>
        Cmn.ReplaceCls(e, "InLnOrdWebPartLayout_AddToOrdIconGreyImg", "InLnOrdWebPartLayout_AddToOrdIconBlackImg");
    }

    Me.MouseOut = function (e) {
        /// <summary>
        /// Handles mouseout of attribute to highlight the element.
        /// </summary>
        /// <param name="e"> The element clicked.</param>	
        Cmn.RemCls(e, "InLnOrdWebPartLayout_AttrHighlight");
    }

    Me.MouseOutCloseBtn = function (e) {
        /// <summary>
        /// Handles mouseout of Close button to change color to grey.
        /// </summary>
        /// <param name="e"> The element clicked.</param>	
        Cmn.ReplaceCls(e, "InLnOrdWebPartLayout_CloseIconBlackImg", "InLnOrdWebPartLayout_CloseIconGreyImg");
    }

    Me.MouseOutAddToOrdBtn = function (e) {
        /// <summary>
        /// Handles mouseout of Add to Order button to change color to grey.
        /// </summary>
        /// <param name="e"> The element clicked.</param>	
        Cmn.ReplaceCls(e, "InLnOrdWebPartLayout_AddToOrdIconBlackImg", "InLnOrdWebPartLayout_AddToOrdIconGreyImg");
    };

    Me.SpecBxKeyPress = function (event, txtArea) {
        /// <summary>
        /// Limits the user input for the spec box to the column text limit
        /// in the database. 
        /// </summary>

        if (txtArea.value.length >= SPEC_TXT_LMT) {
            return false;
        }
    };

    /// #End Region "Event Handlers"

    /// #Region "Public Methods"

    Me.GetOrdHist = function (bxObj) {
        /// <summary>
        /// Retrieves the order history message for a product that is either on the
        /// current order or was ordered in the past. 
        /// </summary>
        /// <param name="itmDscTxt"> The item description text.</param>

        // Set up connection object with passed variables used by success function.
        var cnxnObj = {
            success: hndlOrdHistAJAXResp,
            cnxnParm: {
                respTyp: McMaster.CnxnMgr.WEB_PART_RESP_TYP_TXT,
                ItmDscTxt: bxObj.PartNbrMetaDat.Dsc,
                bxObj: bxObj
            }
        };

        var url = INLN_ORD_HTTP_HANDLER_URL + "?" +
							  ACT_TXT + "=" +
							  GET_ORD_HIST_QS_KY_TXT + "&" +
							  PART_NBR_QS_KY_TXT + "=" +
							  bxObj.PartNbrTxt;
		//add more information to the query string
		if (isInLnSpec(bxObj.PartNbrLnk)) {
			var partNbrLnk = bxObj.PartNbrLnk;
			var attrCompItmIds = partNbrLnk.getAttribute("data-mcm-attr-comp-itm-ids");
			var fullPrsnttnId = getFullPrsnttnId(partNbrLnk);
			var prsnttnId = getPrsnttnId(partNbrLnk); //part number link may exist in either sub or full
			var seqNbr = bxObj.PartNbrLnk.getAttribute("data-mcm-partnbr-seqnbr");

            url = url + "&" +
					  FULL_PRSNTTN_ID_KY_TXT + "=" +
					  fullPrsnttnId + "&" +
					  PRSNTTN_ID_KY_TXT + "=" +
					  prsnttnId + "&" +
					  IS_INLNSPEC + "=" +
					  true + "&" +
					  ATTR_COMP_IDS + "=" +
					  attrCompItmIds;

			var inLnSpecInpDict = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.InLnSpecUsrInps.KyTxt());
			if (inLnSpecInpDict) {
				var inLnSpecId = mBxObj.PartNbrTxt + '_' + prsnttnId;
				if (seqNbr){
					inLnSpecId = inLnSpecId + '_' + seqNbr;
				}
				if (inLnSpecId in inLnSpecInpDict) {
					url = inLnSpecInpDict[inLnSpecId].AddSpecUsrInpQS(url);
				}
			}
		}

        McMaster.CnxnMgr.PerformAjaxCnxn(url, cnxnObj);
    }
	
	
	// <summary> 
	// Retrieves additional content links for the select part number. 
	// </summary>
	// <param name="intrnPartNbrTxt">
	// The internal part number text. This is used to query the database.
	// </param>
	Me.GetAddnlCntntLnks = function (bxObj, mainCntnr) {
		chkPartNbrExcludedForItmPrsnttn(bxObj, mainCntnr);
	}

    Me.HighlightRelevantInLnSpecMarkup = function (bxObj) {
        /// <summary>
        ///  Highlight previously ordered spec values by adding class.
        /// </summary>
        /// <param name="rootElem">
        ///  div containing the inline ordering box markup text
        /// </param>
        // Get the part numbers and attribute values to highlght that are on the page.
        var prtNbrsToHighlight = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.FndAgainPrtNbrsToHighlight.KyTxt())
            , locPrtNbrsToHighlight = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.FndAgainLocPrtNbrsToHighlight.KyTxt())
		    , orderedSpecIdVals = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.FndAgainSpecIdValsToParts.KyTxt());

        if ((Cmn.IsEmpty(prtNbrsToHighlight) == false || Cmn.IsEmpty(locPrtNbrsToHighlight) == false) &&
				Cmn.IsEmpty(orderedSpecIdVals) == false) {

            // Ensure compatibility of code below with IE<9 browsers, support Array.indexOf
            if (!('indexOf' in Array.prototype)) {
                Array.prototype.indexOf = function (find, i /*opt*/) {
                    if (i === undefined) i = 0;
                    if (i < 0) i += this.length;
                    if (i < 0) i = 0;
                    for (var n = this.length; i < n; i++)
                        if (i in this && this[i] === find)
                            return i;
                    return -1;
                }
            };

            var InLnSpecValLnks = Cmn.GetElementsByClsNm("SpecSrch_Value", "td", bxObj.MainCntnr);
            var len = InLnSpecValLnks.length; // performance boost by saving this off	
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    var partNbrMatchInd = false;
                    var currPartNbr = bxObj.PartNbrTxt;
                    var attrCompIdsTxt = bxObj.PartNbrLnk.getAttribute("data-mcm-attr-comp-itm-ids");
                    if (attrCompIdsTxt) {
                        var attrCompIdList = attrCompIdsTxt.split(",");
                    }
                    if ((currPartNbr && prtNbrsToHighlight[currPartNbr]) || (currPartNbr && locPrtNbrsToHighlight[currPartNbr])) {
                        var specValIdArray = InLnSpecValLnks[i].id.split('_');
                        var currSpecProdId = specValIdArray[2];
                        var currSpecProdValId = specValIdArray[5];

                        var prodValIdPair = currSpecProdId + ";" + currSpecProdValId;
                        if (orderedSpecIdVals[prodValIdPair]) {
                            var specPartNbrArray = orderedSpecIdVals[prodValIdPair].split("|");
                            for (var j = 0; j < specPartNbrArray.length; j++) {
                                if (specPartNbrArray[j] === currPartNbr ||
								(attrCompIdList &&
								 (attrCompIdList.indexOf(prtNbrsToHighlight[specPartNbrArray[j]]) >= 0 ||
                                    attrCompIdList.indexOf(locPrtNbrsToHighlight[specPartNbrArray[j]]) >= 0))) {
                                    partNbrMatchInd = true;
                                    break;
                                }
                            }
                            if (partNbrMatchInd) {
                                Cmn.AddCls(InLnSpecValLnks[i], ATTR_VAL_HIGHLIGHTED_CLS);
                            }
                        }
                    }
                }
            }
        }
    }

    Me.UpdtStVals = function () {
        /// <summary>
        /// Updates state values in session in order to keep track of the part numbers for which
        /// inline boxes have already been created and whether they are visible. 
        /// </summary>
        // T2DXC: This essentially doesn't do anything anymore. I may take this 
        // out after building UNDO functionality. 

        // Make the query string text for reloading from sesn.
        // makeSesnLoadQSTxt(inLnBxsCrtd);
        var crtedBxs = mCrtedBxObjs;

        // Set the global variables associated with the javascript objects.
        if (typeof (crtedBxs) == "object") {
            // Session inexplicably clones arrays incorrectly when we're
            // in iFrames. Recast the (now) object back to an array.
            var bxIdx = 0
				  , tempArray = [];

            while (mCrtedBxObjs[bxIdx]) {
                tempArray.push(mCrtedBxObjs[bxIdx]);
                bxIdx++;
            }

            crtedBxs = tempArray;
        }

        // Reorder the sequence of created box objects. 			
        if (crtedBxs.length > 0) {
            // If the current element exists in the array and is not on the end, 
            // move it to the end.
            if (mBxObj.Id == crtedBxs[crtedBxs.length - 1].Id) {
                // Update the entry in the list of created box objects to 
                // mirror the latest values of the active box.
                crtedBxs[crtedBxs.length - 1] = mBxObj;
            } else {
                for (var bxIdx = 0; bxIdx < crtedBxs.length; bxIdx++) {
                    if (mBxObj.Id == crtedBxs[bxIdx].Id) {
                        var tempBxObj = crtedBxs[bxIdx];
                        crtedBxs.splice(bxIdx, 1);
                        crtedBxs.push(tempBxObj);
                        break;
                    }
                }
            }
        }

        // Update the value in session for the array that stores box objects.
        setVal(valDefs.InLnOrdBxsCrtd.KyTxt(), crtedBxs);
        setVal(valDefs.ActvInLnOrdBx.KyTxt(), mBxObj);
        mCrtedBxObjs = crtedBxs;
    }

    Me.TakeSnapShot = function () {
        //Take snapshot for back button.
        var sesnStNbr = getVal(valDefs.InLnOrdBxsSesnStat.KyTxt());
        if (sesnStNbr == null) sesnStNbr = -1;
        setVal(valDefs.InLnOrdBxsSesnStat.KyTxt(), sesnStNbr + 1);
    }

    Me.ResetBxObj = function (targetElem, parentRow) {
        /// <summary>
        /// Retrieves the box ID associated with an existing inline ordering box. 
        /// </summary>
        /// <param name="targetElem">
        /// An element inside the inline ordering box. This will be an element on which
        /// the user has clicked. 
        /// </param>
        /// <remarks>
        /// We also reset the global variable for the box object that the associated
        /// Javascript file (InLnOrdWebPart.js) uses; we need it to know which is the
        /// "active" box. 
        /// </remarks> 

        var bxId = 0
			  , inLnOrdRow = Cmn.GetAncestorByTagNm(targetElem, "tr");

        if (!parentRow) {
            parentRow = Cmn.GetPrevSibling(Cmn.GetPrevSibling(inLnOrdRow));
        }

        while (Cmn.HasCls(parentRow, "AddToOrdFlow_ItmBx")) {
            parentRow = Cmn.GetPrevSibling(Cmn.GetPrevSibling(parentRow));
        }

        var primaryPartNbrCells = Cmn.GetChildrenByClsNm(parentRow, "ItmTblCellPartNbr");
        var primaryPartNbrLnks = [];
        var primaryPartNbrCellsCpy = primaryPartNbrCells;
        var partNbrLnk = Cmn.GetElementBy(function (elem) { return Cmn.HasCls(elem, "AddToOrdBxCreated"); }, "a", parentRow);

        if (!partNbrLnk) {
            partNbrLnk = Cmn.GetElementsByClsNm("AddToOrdBxCreated" + mBxObj.Id, "a", parentRow)[0];
        }

        var lnkClsNms = partNbrLnk.className.split(" ")
			  , partNbrLnks = Cmn.GetElementsByAttrVal("data-mcm-itm-id", partNbrLnk.getAttribute("data-mcm-itm-id"));

        for (var h = 0; h < primaryPartNbrCellsCpy.length; h++) {
            if (Cmn.HasCls(primaryPartNbrCells[h], "ItmTblFiller")) {
                primaryPartNbrCells.splice(h, 1);
                h--;
            }
        }

        if (primaryPartNbrCells.length > 1) {
            for (var i = 0; i < primaryPartNbrCells.length; i++) {
                if (Cmn.GetChildrenByClsNm(primaryPartNbrCells[i], "PartNbrLnk")) {
                    primaryPartNbrLnks.push(Cmn.GetChildrenByClsNm(primaryPartNbrCells[i], "PartNbrLnk"))[0];

                }
            }
        }

        if (primaryPartNbrLnks.length > 1) {
            for (var j = 0; j < primaryPartNbrLnks.length; j++) {
                if (partNbrLnk && primaryPartNbrCells[primaryPartNbrCells.length - (j + 2)]) {
                    if (partNbrLnk != Cmn.GetChildrenByClsNm(primaryPartNbrCells[primaryPartNbrCells.length - (j + 2)], "PartNbrLnk")[0]) {
                        var primaryPartNbrCell = Cmn.GetChildrenByClsNm(primaryPartNbrCells[primaryPartNbrCells.length - (j + 2)], "PartNbrLnk")[0];
                        break;
                    }
                }
            }
        } else {
            var primaryPartNbrCell = Cmn.GetChildrenByClsNm(primaryPartNbrCells[primaryPartNbrCells.length - 1], "PartNbrLnk")[0];
        }

        var primaryPartNbrTxts;
        var primaryIds = [];
        var primLnk;
        var primId;

        if (primaryPartNbrCell) {
            for (var k = 0; k < primaryPartNbrLnks.length; k++) {
                primLnk = primaryPartNbrLnks[k];
                primId = primLnk[0].getAttribute("data-mcm-itm-id");
                if (primId != partNbrLnk.getAttribute("data-mcm-itm-id")) {
                    primaryIds.push(primId);
                }
            }
            if (primaryIds.length > 1) {
                primaryPartNbrTxts = primaryIds.join("|");
            } else {
                primaryPartNbrTxts = primaryIds[0];
            }
        }

        var crtedBxObjsLength = 0;
        for (var i in mCrtedBxObjs) {
            if (mCrtedBxObjs.hasOwnProperty(i)) {
                crtedBxObjsLength++;
            }
        }

        // Find the id for the box associated with this part number link. 
        for (var clsIdx = 0; clsIdx < lnkClsNms.length; clsIdx++) {
            if (bxId == 0) {
                // Continue.
                for (var bxIdx = 0; bxIdx < crtedBxObjsLength; bxIdx++) {
                    var prevSibling = Cmn.GetPrevSiblingBy(mCrtedBxObjs[bxIdx].PartNbrCell, function (elem) { return Cmn.HasCls(elem, "ItmTblCellPartNbr") });
                    while (Cmn.HasCls(prevSibling, "ItmTblFiller")) {
                        prevSibling = Cmn.GetPrevSiblingBy(prevSibling, function (elem) { return Cmn.HasCls(elem, "ItmTblCellPartNbr") });
                    }
                    if ((mCrtedBxObjs[bxIdx].PrimaryPartNbrTxts != "") && primaryPartNbrTxts) {
                        if ((mCrtedBxObjs[bxIdx].PrimaryPartNbrTxts = primaryPartNbrTxts)
								&& (lnkClsNms[clsIdx].indexOf(mCrtedBxObjs[bxIdx].Id) > -1)
								&& (prevSibling === Cmn.GetAncestorByClsNm(primaryPartNbrCell, "ItmTblCellPartNbr"))) {
                            // Reset the box from which the regular javascript file
                            // is pulling its information.
                            Me.SetJSBxObjProperties(mCrtedBxObjs[bxIdx]);
                            break;
                        }
                        else if (lnkClsNms[clsIdx].indexOf(mCrtedBxObjs[bxIdx].Id) > -1) {
                            // Reset the box from which the regular javascript file

                            // is pulling its information.
                            Me.SetJSBxObjProperties(mCrtedBxObjs[bxIdx]);
                        }
                    }
                    else if (primaryPartNbrTxts && primaryPartNbrTxts.indexOf(mCrtedBxObjs[bxIdx].Id) > -1) {
                        // Reset the box from which the regular javascript file
                        // is pulling its information.
                        Me.SetJSBxObjProperties(mCrtedBxObjs[bxIdx]);
                    }
                    else if (partNbrLnk.getAttribute("data-mcm-itm-id").indexOf(mCrtedBxObjs[bxIdx].Id) > -1) {
                        // Reset the box from which the regular javascript file
                        // is pulling its information.
                        Me.SetJSBxObjProperties(mCrtedBxObjs[bxIdx]);
                    }
                }
            } else {
                // We've found the id, exit the loop.
                break;
            }
        }
    }

    // <summary>
    // Creates the buffer row between inline ordering boxes so adjacent ones
    // don't touch. 
    // </summary>
    Me.CrteBufferRow = function (parentRow) {
        while (Cmn.HasCls(parentRow, "AddToOrdFlow_ItmBx")) {
            parentRow = Cmn.GetPrevSibling(parentRow);
        }

        var bufferRow
		  , bufferCell;

        if (McMasterCom.Nav.GetTopFrame().MainIFrame.Catalog && (Cmn.IsIE6() || Cmn.IsIE7())) {
            bufferRow = parentRow.parentNode.parentNode.insertRow(parentRow.rowIndex);

            Cmn.AddCls(bufferRow, "InLnOrdWebPart_BufferRowFor" + mBxObj.PartNbrTxt);
            Cmn.SetStyle(bufferRow, "height", BUFFER_HGT + "px");

            for (var cellIdx = 0; cellIdx < mBxObj.TblCells.length; cellIdx++) {
                bufferCell = bufferRow.insertCell();
            }
        } else {
            bufferRow = Cmn.CrteElement("tr");
            Cmn.AddCls(bufferRow, "InLnOrdWebPart_BufferRowFor" + mBxObj.PartNbrTxt);
            Cmn.SetStyle(bufferRow, "height", BUFFER_HGT + "px");
            for (var cellIdx = 0; cellIdx < mBxObj.TblCells.length; cellIdx++) {
                bufferCell = Cmn.CrteElement("td");
                bufferRow.appendChild(bufferCell);
            }
            Cmn.InsrtBefore(bufferRow, parentRow);
        }
    };

    // <summary>
    // When the user clicks on a part number that will render part 
    // of an inline ordering box below the fold, we scroll the presentation
    // pane such that the entire box is visible. 
    // </summary>
    Me.ScrollToShowInLnOrdCntnr = function () {
        var inLnOrdCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPart_RacingStripe", "div", mBxObj.BxCntntCell)[0]
		  , partNbrLnkPosn
		  , horzScrollBarCatalog;

        // Get the position of the horizontal scroll bar based on the browser. 
        if (typeof (window.scrollX) == "undefined") {
            // IE
            horzScrollBarCatalog = window.document.body.scrollLeft;
        } else {
            // All other browsers. 
            horzScrollBarCatalog = window.scrollX;
        }
		
		var appModeValTxt = Cmn.GetQSVal(APP_MODE_PREF_TXT);
        // --------------------------------------
        // horzScrollBarCatalog should be changed to Cmn.GetObj("CtlgPageShell_CtlgPage_Cntnr").scrollLeft

        // If and only if we are in a catalog page the masthead height will be 0. 
        if (MASTHEAD_HGT == 0 && appModeValTxt == "") {
            // If true you are on a catalog page and need to execute the scrolling function for the catalog page. 

            // If the context of the part number selected message is "FullPrsntnn" the request to open the inline 
            // box has come from a dynamically generated catalog page and the box will need to be scrolled 
            // so the bottom of the box is above the fold. 

            //use the offset y for catalog pages
            partNbrLnkPosn = Cmn.GetYOffset(mBxObj.PartNbrLnk);
            if (mWebPartObj.PartNbrSlctdMsgCntxtNm == "FULLPRSNTTN") {
                var inLnOrdCntnrPosnCatalog = Cmn.GetHeight(inLnOrdCntnr) + Cmn.GetHeight(mBxObj.PartNbrCell) + partNbrLnkPosn
					  , vertScrollBarCatalog
					  , catalogFrameScrollPosn
					  , scrollCntnr = Cmn.GetObj("CtlgPageShell_CtlgPage_Cntnr");

                if (scrollCntnr) {
                    // Find the positions of the vertical scroll bar, the bottom of our box, and the window height.
                    vertScrollBarCatalog = scrollCntnr.scrollTop;
                    // Find the height of the scrollable region in the catalog iframe. 
                    catalogFrameScrollPosn = scrollCntnr.clientHeight + vertScrollBarCatalog - BOTTOMNAVTOOLSET_HGT;
                }

                if (inLnOrdCntnrPosnCatalog < catalogFrameScrollPosn) {
                    //Do nothing because the bottom of the box is not below the fold
                } else {
                    //Determine the distance the box needs to scroll so it is seen above
                    //the fold and scroll by that distance
                    var newScrollPosnWthHorzScrollBarCatalog = vertScrollBarCatalog +
														(inLnOrdCntnrPosnCatalog - catalogFrameScrollPosn)
														+ HORZSCROLLBARBUFFER + SCROLLBUFFER;
                    scrollCntnr.scrollTop += newScrollPosnWthHorzScrollBarCatalog;
                }

                // If the context of the message is not "FULLPRSNTTN" the request to open the box has come from 
                // the catalog page link in the box, a part number search, or the part number link in 
                // order pad and the inline box needs to be scrolled to the center of the screen. 
            } else {
                //use the GetY
                partNbrLnkPosn = Cmn.GetY(mBxObj.PartNbrLnk);
                scrollInLnBxToCntr(partNbrLnkPosn, horzScrollBarCatalog);
            }
        } else {
            //use the GetY for regular pages
            partNbrLnkPosn = Cmn.GetY(mBxObj.PartNbrLnk);

            // If else on a dynamic page and execute scrolling function for dynamic page. 
            var inLnOrdCntnrPosnDynamic;
            if (partNbrLnkPosn) {
                inLnOrdCntnrPosnDynamic = Cmn.GetHeight(inLnOrdCntnr) + Cmn.GetHeight(mBxObj.PartNbrCell)
											+ partNbrLnkPosn - TOOLSET_HGT - MASTHEAD_HGT;
            } else {
                inLnOrdCntnrPosnDynamic = Cmn.GetHeight(inLnOrdCntnr) + Cmn.GetHeight(mBxObj.PartNbrCell)
											- TOOLSET_HGT - MASTHEAD_HGT;
            }

            var viewableAreaHgtDynamic = Cmn.GetViewportHeight() - TOOLSET_HGT - MASTHEAD_HGT - BOTTOMNAVTOOLSET_HGT;

            if (inLnOrdCntnrPosnDynamic < viewableAreaHgtDynamic) {
                // Do nothing.
            } else {
                // Get the content container
                var prodPageCntntCntnr = Cmn.GetElementsByClsNm("ProdPageContent")[0]
					  , origScrollPosnDynamic = Cmn.GetVerticalScrollPosn(prodPageCntntCntnr)
					  , newScrollPosnDynamic = origScrollPosnDynamic + inLnOrdCntnrPosnDynamic
											- viewableAreaHgtDynamic + TOOLSET_HGT + SCROLLBUFFER
					  , horzScrollBarDynamic = Cmn.ChkForScrollBar(prodPageCntntCntnr, "horizontal")
					  , newScrollPosnWthHorzScrollBarDynamic = newScrollPosnDynamic + HORZSCROLLBARBUFFER;

                // If a horizontal scroll bar exists, its height needs to be taken into account when shifting. 
                if (horzScrollBarDynamic == true) {
                    Cmn.SetVerticalScrollPosn(prodPageCntntCntnr, newScrollPosnWthHorzScrollBarDynamic);
                } else {
                    Cmn.SetVerticalScrollPosn(prodPageCntntCntnr, newScrollPosnDynamic);
                }
            }
        }
    };

    // <summary>
    // Reduces the rowspan of any embedded content cells back to their pre-inline ordering
    // box values or increases it by three (buffer row, header row, content row). For images 
    // and copy embedded in tables. 
    // </summary>
    Me.ModifyRowSpanOnCntntCells = function (rowCnt, bxCntntRow) {
        // See if the row in which the user clicked the part number contains an embedded content cell. 
        var tblCntntCell = Cmn.GetElementBy(function (elem) { return (Cmn.HasCls(elem, "ItmTblPivotImgCell") || Cmn.HasCls(elem, "ItmTblImgCell")); }, "td", mBxObj.ParentRow)
		  , oldRowSpan
		  , newRowSpan;

        // If we do find an embedded content cell in the row clicked, then modify its row span so that 
        // the inline ordering box does not disrupt the layout of the rest of the table. 
        if (tblCntntCell) {
            oldRowSpan = tblCntntCell.rowSpan;
            newRowSpan = oldRowSpan + rowCnt;
			
			if (newRowSpan < 1){
				newRowSpan = 1;
			}
            tblCntntCell.rowSpan = newRowSpan;
        } else {
            // If we do not find it in the row clicked, search table rows above the row clicked until
            // an embedded content cell is found or we run out of rows to search.
            // TODO: This is a potential performance drain but there's no better way to do it now. Many
            // 		 tables have multiple embedded content cells. 
            var row = bxCntntRow;
            if (row) {
                //do nothing
            } else {
                row = mBxObj.ParentRow
            }
            var prevRow = Cmn.GetPrevSibling(row);

            while (prevRow) {
                tblCntntCell = Cmn.GetElementBy(function (elem) { return (Cmn.HasCls(elem, "ItmTblImgCell") || Cmn.HasCls(elem, "ItmTblPivotImgCell")); }, "td", prevRow);

                if (tblCntntCell) {
                    oldRowSpan = tblCntntCell.rowSpan;
                    newRowSpan = oldRowSpan + rowCnt;
                    tblCntntCell.rowSpan = newRowSpan;
                    break;
                } else {
                    prevRow = Cmn.GetPrevSibling(prevRow);
                }
            }
        }
    }

    Me.HideInLnBx = function (bxHdrRow, bxCntntRow, partNbrCell, closeInd) {
        /// <summary>
        /// Hides the inline box of the part number selected
        /// </summary>

        var itmAdded = false
		   , partNbrLnk = Cmn.GetFrstChld(partNbrCell)
		   , partNbrTxt
		   , bufferRow
		   , actvBx = mBxObj;

        if (partNbrLnk.innerHTML.length > 0) {
            partNbrTxt = partNbrLnk.innerHTML;
        } else {
            //partNbrCell that is passed into this function may not exist in the DOM
            //in that case, IE freaks out when trying to access the property
            //Instead of using innerHTML, use the hash. This is hackish.
            partNbrTxt = partNbrLnk.hash.replace("#", "");
        }

        bufferRow = Cmn.GetPrevSiblingBy(bxHdrRow, function (elem) { return Cmn.HasCls(elem, "InLnOrdWebPart_BufferRowFor" + partNbrTxt); });

        if (!partNbrCell) {
            partNbrCell = actvBx.PartNbrCell;
            partNbrLnk = actvBx.PartNbrLnk;
        }

        //hide inline order spec box
        hideInLnSpecBx(partNbrLnk);
        
        hideAttrMenu(actvBx.MainCntnr);

        if (bufferRow) {
            // Remove the buffer row.
            Cmn.RemElem(bufferRow);
        } else {
            //we should not be getting into this code 
            bufferRow = findBufferRow();
            if (bufferRow) {
                Cmn.RemElem(bufferRow);
            }
        }

        // Check to see if the part number was added to the order.	
        if (Cmn.HasCls(bxCntntRow, "InLnOrdWebPart_ItmAdded")) {
            itmAdded = true;
        }

        // Reduce the rowspan of any embedded content cells back to their pre-inline ordering box
        // values.			
        if (Cmn.IsIE6() || Cmn.IsIE7()) {
            InLnOrdWebPart.ModifyRowSpanOnCntntCells(-1, bxCntntRow);
        } else {
            InLnOrdWebPart.ModifyRowSpanOnCntntCells(-3, bxCntntRow);
        }

        //remove elements
        Cmn.ReplaceCls(partNbrLnk, "AddToOrdBxCreated", "AddToOrdBxHidden");
        Cmn.ReplaceCls(partNbrCell, "AddToOrdBxCreated", "AddToOrdBxHidden");

        // Change classes of the part number link that was selected
        Cmn.ReplaceCls(partNbrLnk, "PartNbrSlctd", "PartNbrVisitedLnk");

        // Gather all of the remaining part numbers that are selected and 
        // loop through all of them to remove the selected class
        var partNbrLnks = Cmn.GetElementsByClsNm("PartNbrSlctd", "a");
        for (var partNbrLnkIdx = 0; partNbrLnkIdx < partNbrLnks.length; partNbrLnkIdx++) {
            Cmn.RemCls(partNbrLnks[partNbrLnkIdx], "PartNbrSlctd");
        }

        // Change class on the part number cell to remove the border around the 
        // part number and change the padding.
        Cmn.ReplaceCls(partNbrCell, "InLnOrdWebPartLayout_ItmTblPartNbrCell", "ItmTblColSpacePartNbr");
		
		//Remove tooltip
        partNbrLnk.title = "";
       
	   // Re-add the horizontal rule to the row with the part number.
        reAddHorzntlRule(actvBx.BxCntntCell);

        // Update the value of the visibility indicator on this part number's
        // javascript object to false. 
        actvBx.VisibilityInd = false;
        // Publish for webreports tracking.
        Cmn.TrkAct("InLnOrdClose&partnbr=" + actvBx.PartNbrTxt, "InLnOrd");

        setVal(valDefs.ActvInLnOrdBx.KyTxt(), actvBx);
        mBxObj = actvBx;
        Me.TakeSnapShot();

        //box has been manually closed. Remove the box 
        if (closeInd) {
            remInLnOrdBx(bxHdrRow, bxCntntRow, partNbrLnk.innerHTML, partNbrLnk);
        }

        // Publish the inline order box closed message. Used for pinned content. 
        var inlnOrdBxClosMsgHdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.FULL_PRSNTTN)
				  , inlnOrdBxClosMsg = new McMaster.MsgMgrMsgs.InlnOrdBxClosed(inlnOrdBxClosMsgHdr);

        McMaster.MsgMgr.PubMsg(inlnOrdBxClosMsg);
    }

    // <summary>
    // Shows the inline box of the part number selected
    // </summary>
    Me.ShowInLnBx = function (inLnBxHdrRw, inLnBxCntntRw, partNbrCell) {
        var partNbrLnk = Cmn.GetFrstChld(partNbrCell);

        Me.RegenerateJSBxObj(partNbrLnk);
        setVal(valDefs.ActvInLnOrdBx.KyTxt(), mBxObj);
        var parentRow = Cmn.GetAncestorByTagNm(partNbrCell, "tr");
        // Check to see if there are multiple part numbers and if so, check if one has a 
        // inline box opened.
        var newBxOpenedInMultPartNbrRowInd = Me.HndlRowsWithMultPartNbrs(parentRow)
		  , actvBx = mBxObj;

        var prevRow = Cmn.GetPrevSibling(parentRow);
        if (prevRow && prevRow.className.Contains("Buffer")) {
            // Do nothing. We want to reuse the same buffer row. If we don't do this, 
            // stacked pivot tables have the potential to become messed up. 
        } else {
            var parentRow = Cmn.GetPrevSibling(inLnBxHdrRw);
            // Create the buffer row.
            InLnOrdWebPart.CrteBufferRow(parentRow);

            // Increase the rowspan of any embedded content cells so that 
            // they do not force unrelated content in the table to wrap.					
            if (Cmn.IsIE6() || Cmn.IsIE7()) {
                InLnOrdWebPart.ModifyRowSpanOnCntntCells(1, inLnBxCntntRw);
            } else {
                InLnOrdWebPart.ModifyRowSpanOnCntntCells(3, inLnBxCntntRw);
            }
        }

        // Change classes on the link.
        Cmn.RemCls(partNbrLnk, "PartNbrVisitedLnk");
        Cmn.ReplaceCls(partNbrLnk, "AddToOrdBxHidden", "AddToOrdBxCreated");
        Cmn.AddCls(partNbrLnk, "PartNbrSlctd");

        // Change classes on the part number cell to add the border around the part number 
        Cmn.ReplaceCls(partNbrCell, "ItmTblColSpacePartNbr", "InLnOrdWebPartLayout_ItmTblPartNbrCell");

        // If there is a horizontal rule under the row with the part number, move the rule under the 
        // inline ordering box.
        if (Cmn.HasCls(actvBx.BxCntntCell, "InLnOrdWebPartLayout_HorizontalRule")) {
            for (var tblCellIdx = 0; tblCellIdx < actvBx.TblCells.length; tblCellIdx++) {
                Cmn.RemCls(actvBx.TblCells[tblCellIdx], "ItmTblAllRuleContentCell");
            }
        }

        // Show the header and content row.
        Cmn.RemCls(inLnBxHdrRw, "Hide");
        Cmn.RemCls(inLnBxCntntRw, "Hide");

        //Place the focus on the quantity box so users can easily enter a quantity. 
        var inpBx = Cmn.GetObj("qtyInp" + actvBx.PartNbrTxt);
        if (inpBx) {
            inpBx.focus();
        }

        // Change the current tool tip to indicate that the box is open and clicking the part 
        // number will close the box. 
        partNbrLnk.title = "Close";

        //Scroll the content to show the whole box on the screen.
        InLnOrdWebPart.ScrollToShowInLnOrdCntnr();

        // Update the value of the visibility indicator on this part number's
        // javascript object to false. 
        actvBx.VisibilityInd = true;

        setVal(valDefs.ActvInLnOrdBx.KyTxt(), actvBx);

        //Update the state.
        Me.UpdtStVals();
        Me.TakeSnapShot();
    }

    // <summary>
    // When we encounter presentations that have multiple part numbers in
    // one row, we need to check if there is already a box open in that row
    // and close it before we open the new one. 
    // </summary>
    Me.HndlRowsWithMultPartNbrs = function (parentRow) {
        var tblCell
		  , otherPartNbrLnk
		  , rtnOpenedNewBoxInd = false
		  , actvSesnBx = getVal(valDefs.ActvInLnOrdBx.KyTxt())
		  , partNbrCells = Cmn.GetChildrenByClsNm(parentRow, "ItmTblContentCell");

        // Loop through all columns looking for part numbers.			
        for (var colIdx = 0; colIdx < partNbrCells.length; colIdx++) {
            // See if there is a part number in the same row that has an add to order box 
            // different from the one that the user clicked. 
            if (actvSesnBx) {
                otherPartNbrLnk = Cmn.GetElementBy(function (elem) { return (Cmn.HasCls(elem, "AddToOrdBxCreated") || Cmn.HasCls(elem, "AddToOrdBxHidden")); }, "a", partNbrCells[colIdx]);
            } else {
                otherPartNbrLnk = Cmn.GetElementBy(function (elem) { return (Cmn.HasCls(elem, "AddToOrdBxCreated") || Cmn.HasCls(elem, "AddToOrdBxHidden")); }, "a", partNbrCells[colIdx]);
            }
            if (otherPartNbrLnk && otherPartNbrLnk != mBxObj.PartNbrLnk) {
                // We only want one box open per row, so hide the currently open box to prepare to 
                // open the box for the part number clicked.
                var otherPartNbrAddToOrdClsNm
			      , actvBx = mBxObj;

                // Set the global variables associated with the javascript objects.
                if (typeof (mCrtedBxObjs) == "object") {
                    // Session inexplicably clones arrays incorrectly when we're
                    // in iFrames. Recast the (now) object back to an array.
                    var bxIdx = 0
						  , tempArray = [];

                    while (mCrtedBxObjs[bxIdx]) {
                        tempArray.push(mCrtedBxObjs[bxIdx]);
                        bxIdx++;
                    }

                    mCrtedBxObjs = tempArray;
                }

                for (var openedBxsIdx = 0; openedBxsIdx < mCrtedBxObjs.length; openedBxsIdx++) {
                    if (Cmn.HasCls(otherPartNbrLnk, "AddToOrdBxCreated" + mCrtedBxObjs[openedBxsIdx].Id)) {
                        otherPartNbrAddToOrdClsNm = "AddToOrdFlow_ItmBxFor" + mCrtedBxObjs[openedBxsIdx].Id;
                        mCrtedBxObjs[openedBxsIdx].VisibilityInd = false;
                        mCrtedBxObjs[openedBxsIdx].ClosedByForceInd = true;
                        break;
                    } else {
                        // Continue. 
                    }
                }

                var otherAddToOrdHdrRow = Cmn.GetNxtSiblingBy(parentRow, function (elem) { return (Cmn.HasCls(elem, otherPartNbrAddToOrdClsNm) && !Cmn.HasCls(elem, "Hide")); })
				  , otherAddToOrdCntntRow = Cmn.GetNxtSibling(otherAddToOrdHdrRow)
				  , otherAddToOrdCntntCell = Cmn.GetFrstChld(otherAddToOrdCntntRow);

                Cmn.AddCls(otherAddToOrdHdrRow, "Hide");
                Cmn.AddCls(otherAddToOrdCntntRow, "Hide");

                Cmn.ReplaceCls(partNbrCells[colIdx].firstChild, "AddToOrdBxCreated", "AddToOrdBxHidden");
                Cmn.ReplaceCls(partNbrCells[colIdx], "AddToOrdBxCreated", "AddToOrdBxHidden");
                Cmn.ReplaceCls(partNbrCells[colIdx].firstChild, "PartNbrSlctd", "PartNbrVisitedLnk");
                Cmn.ReplaceCls(partNbrCells[colIdx], "InLnOrdWebPartLayout_ItmTblPartNbrCell", "ItmTblColSpacePartNbr");

                reAddHorzntlRule(otherAddToOrdCntntCell);

                rtnOpenedNewBoxInd = true;

                setVal(valDefs.ActvInLnOrdBx.KyTxt(), actvBx);

                Me.UpdtStVals();
            }
        }
        return rtnOpenedNewBoxInd;
    };

    // <summary>
    // When the user clicks the back button, we will reinsert boxes using 
    // markup stored in box objects in session. This is used for catalog pages
    // and dynamic content. 
    // </summary>
    Me.InsertMarkup = function (bxObj, bxIdx, bxCnt, inLnBxs, specInd) {
        var catInd = false;
        if (McMasterCom.Nav.GetTopFrame().MainIFrame.Catalog) {
            // We're on a catalog page and the frame doesn't unload.
            var partNbrLnks = window.MainIFrame.Catalog.Cmn.GetElementsByAttrVal("data-mcm-itm-id", bxObj.Id, "a")
			  , partNbrLnk = bxObj.PartNbrLnk
			  , parentRow = window.MainIFrame.Catalog.Cmn.GetAncestorByTagNm(partNbrLnk, "tr")
			  , catInd = true;
        } else {
            var partNbrLnks = Cmn.GetElementsByAttrVal("data-mcm-itm-id", bxObj.Id, "a")
			  , partNbrLnk = partNbrLnks[0]
			  , parentRow = Cmn.GetAncestorByTagNm(partNbrLnk, "tr");

            if (partNbrLnk) {
                bxObj.PartNbrLnk = partNbrLnk;
            }
        }

        if (parentRow && (!Cmn.HasCls(partNbrLnk, "AddToOrdBxCreated"))) { // also ensure box is not already open
            // Check to see how many times this product appears on the page. 
            if (partNbrLnks.length == 1) {
                // This product only appears once on the page. Do nothing. 
            } else if (partNbrLnks.length > 0) {
                // This product appears multiple times on the page. 
                // Make sure we grab the correct row.				
                var partIds = []
					  , primariesTxt
					  , parentRow = null;

                // Gather all the parent rows of each instance of the product on the page and loop 
                // through each one, gathering all the part number links contained therein. If we 
                // come across a part that is not the same as the one that appears multiple times
                // on the page, push it to an array. If the array contains parts in the PrimaryPartNbrTxts
                // property on the box object, then insert it into the DOM. 					
                for (var partIdx = 0; partIdx < partNbrLnks.length; partIdx++) {
                    if (parentRow === null) {
                        // Continue. We haven't found the right parent row yet. 

                        // Build the array of primary part IDs. 
                        var lnkParentRow = Cmn.GetAncestorByTagNm(partNbrLnks[partIdx], "tr");
                        lnks = Cmn.GetElementsBy(function (elem) { return elem; }, "a", lnkParentRow);
                        for (var lnkIdx = 0; lnkIdx < lnks.length; lnkIdx++) {
                            if (lnks[lnkIdx].getAttribute("data-mcm-itm-id") != bxObj.Id) {
                                partIds.push(lnks[lnkIdx].getAttribute("data-mcm-itm-id"));
                            }
                        }

                        if (partIds.length == 0) {
                            nextSblng = Cmn.GetNxtSibling(lnkParentRow);
                            if (nextSblng = bxObj.BxCntntRow.nextSibling) {
                                parentRow = lnkParentRow;
                                break;
                            }
                        }

                        // Loop through the IDs looking for one that's contained in the PrimaryPartNbrTxts property.
                        for (var primIdx = 0; primIdx < partIds.length; primIdx++) {
                            if (bxObj.PrimaryPartNbrTxts.indexOf(partIds[primIdx]) > -1) {
                                // If we find one that's in the string, assign the parent row and 
                                // abandon the rest of the loop.
                                partNbrLnk = partNbrLnks[partIdx];
                                parentRow = lnkParentRow;
                                if (Cmn.HasCls(partNbrLnk, "AddToOrdBxCreated")) {
                                    break;
                                }
                            } else {
                                // Continue.
                            }
                        }
                    } else {
                        // We've found the parent row. 
                        break;
                    }
                }
            } else {
                // Do nothing.
            }


            // If the header or content row are not found, default to load a
            // new box with new data from the server.
            if (bxObj.BxCntntRow && bxObj.BxHdrRow) {

                //Reinsert the markup for the boxes that were showing. 
                if ((bxObj.VisibilityInd == true) && (bxObj.mWebPartObj.AutoSlctdPartNbrInd == false)) {
                    var partNbrCell = Cmn.GetAncestorByTagNm(partNbrLnk, "td");
                    // Add border and bolding of text to part number cell
                    Cmn.ReplaceCls(partNbrLnk, "PartNbrVisitedLnk", "PartNbrSlctd");
                    Cmn.ReplaceCls(partNbrCell, "ItmTblColSpacePartNbr", "InLnOrdWebPartLayout_ItmTblPartNbrCell");
                    Cmn.AddCls(partNbrLnk, "AddToOrdBxCreated");
                    Cmn.AddCls(partNbrLnk, "AddToOrdBxCreated" + bxObj.Id);

                    var bxHdrRow,
					    leftHdrCell,
						middleHdrCell,
						rightHdrCell;

                    if (catInd && (Cmn.IsIE7() || Cmn.IsIE6())) {
                        bxHdrRow = parentRow.parentNode.parentNode.insertRow(parentRow.rowIndex + 1);
                        leftHdrCell = bxHdrRow.insertCell();
                        middleHdrCell = bxHdrRow.insertCell();
                        rightHdrCell = bxHdrRow.insertCell();
                    } else {
                        bxHdrRow = Cmn.CrteElement("tr");
                        leftHdrCell = Cmn.CrteElement("td");
                        middleHdrCell = Cmn.CrteElement("td")
                        rightHdrCell = Cmn.CrteElement("td");
                    }

                    Cmn.AddCls(bxHdrRow, "AddToOrdFlow_ItmBx");
                    Cmn.AddCls(bxHdrRow, "AddToOrdFlow_ItmBxFor" + bxObj.Id);
                    Cmn.AddCls(bxHdrRow, "InLnOrdWebPartLayout_HdrRw");

                    // Build the left header cell. We have to build these elements
                    // since the innerHTML operator is read-only for tr's in IE. 

                    Cmn.AddCls(leftHdrCell, "InLnOrdWebPartLayout_LeftHdrCell");
                    leftHdrCell.colSpan = bxObj.LeftHdrCellColSpan;
                    leftHdrCell.innerHTML = bxObj.LeftHdrCellMarkupTxt;
                    rightHdrCell.colSpan = bxObj.RightHdrCellColSpan;
                    rightHdrCell.innerHTML = bxObj.RightHdrCellMarkupTxt;

                    if (catInd && (Cmn.IsIE7() || Cmn.IsIE6())) {
                        //do nothing
                    } else {
                        bxHdrRow.appendChild(leftHdrCell);
                        bxHdrRow.appendChild(middleHdrCell);
                        bxHdrRow.appendChild(rightHdrCell);

                        Cmn.InsrtAfter(bxHdrRow, parentRow);
                    }

                    bxHdrRow = Cmn.GetNxtSibling(parentRow);
                    var bxCntntRow,
						bxCntntCell;

                    if (catInd && (Cmn.IsIE7() || Cmn.IsIE6())) {
                        bxCntntRow = parentRow.parentNode.parentNode.insertRow(bxHdrRow.rowIndex + 1);
                        bxCntntCell = bxCntntRow.insertCell();
                    } else {
                        bxCntntRow = Cmn.CrteElement("tr");
                        bxCntntCell = Cmn.CrteElement("td");
                    }
                    Cmn.AddCls(bxCntntRow, "AddToOrdFlow_ItmBx");
                    Cmn.AddCls(bxCntntRow, "AddToOrdFlow_ItmBxFor" + bxObj.Id);
                    Cmn.AddCls(bxCntntRow, "InLnOrdWebPart_CntntRowFor" + bxObj.Id);

                    bxCntntCell.colSpan = bxObj.BxCntntCellColSpan;
                    bxCntntCell.id = bxObj.mWebPartObj.CntnrIDTxt;
                    bxCntntCell.innerHTML = bxObj.BxCntntCellMarkupTxt;
                    bxCntntRow.appendChild(bxCntntCell);
                    bxObj.BxCntntRow = bxCntntRow;

                    if (catInd && (Cmn.IsIE7() || Cmn.IsIE6())) {
                        //do nothing
                    } else {
                        Cmn.InsrtAfter(bxCntntRow, bxHdrRow);
                    }
                    var parentCells = Cmn.GetChildrenByClsNm(parentRow, "ItmTblAllRuleContentCell");
                    if (parentCells) {
                        for (var i = 0; i < parentCells.length; i++) {
                            Cmn.RemCls(parentCells[i], "ItmTblAllRuleContentCell");
                        }
                    }

                    Me.GetOrdHist(bxObj);
                    Me.GetAddnlCntntLnks(bxObj);
                    Me.HighlightRelevantInLnSpecMarkup(mBxObj);

                    // Reset the part number link property so that it refreshes properties
                    // that refer to elements in the DOM. 
                    bxObj.mPartNbrLnk = partNbrLnk;

                    var tempBx = new InLnOrdWebPartJSObj.BxObj(bxObj.mPartNbrLnk, bxObj.mWebPartObj);

                    InLnOrdWebPartJSObj.SetMarkupProperties(tempBx);
                    setVal(valDefs.ActvInLnOrdBx.KyTxt(), tempBx);
                    mBxObj = getVal(valDefs.ActvInLnOrdBx.KyTxt());
                    Me.CrteBufferRow(parentRow);
                    // Increase the rowspan of any embedded content cells so that
                    // they do not force unrelated content in the table to wrap.
                    InLnOrdWebPart.ModifyRowSpanOnCntntCells(2, bxCntntRow);
                    mCrtedBxObjs.push(mBxObj);
                    if (bxIdx + 1 == bxCnt) {
                        // If we're on the last box in the array and the one preceding it was one that was closed
                        // by force, i.e. a box that resides in the same row as the one just populated, then we
                        // must mark that box to be opened on the next back button click. 
                        if (inLnBxs[bxIdx - 1] && inLnBxs[bxIdx - 1].VisibilityInd == false && inLnBxs[bxIdx - 1].ClosedByForceInd == true) {
                            inLnBxs[bxIdx - 1].VisibilityInd = true;
                            setVal(valDefs.InLnOrdBxsCrtd.KyTxt(), inLnBxs);
                        }
                    }

                } else if (bxObj.VisibilityInd == false) {
                    // Show a visited part number link.
                    Cmn.ReplaceCls(partNbrLnk, "PartNbrSlctd", "PartNbrVisitedLnk");
                }

                if (specInd == false) {
                    // If we're on the last box in the array, then check to see if the visibility indicator is
                    // true or false. If it's false then we want to reopen this box on the next back button click.
                    // If it's true, then we want to close it. Update the session state accordingly. 
                    if (bxIdx + 1 == bxCnt) {
                        if (bxObj.VisibilityInd == true) {
                            //inLnBxs.splice(bxIdx, 1);

                        } else {
                            inLnBxs[bxIdx].VisibilityInd = true;
                        }

                        setVal(valDefs.InLnOrdBxsCrtd.KyTxt(), inLnBxs);
                    }
                }
                // Publish the inline order box reopened message.
                var inlnOrdBxReopenMsgHdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.FULL_PRSNTTN)
							  , inlnOrdBxReopenMsg = new McMaster.MsgMgrMsgs.InlnOrdBxReopened(inlnOrdBxReopenMsgHdr);

                McMaster.MsgMgr.PubMsg(inlnOrdBxReopenMsg);
            }
            if (Cmn.GetElementsByClsNm("ProdPageContent")[0]) {
                Me.ScrollToShowInLnOrdCntnr();
            }
            var inpBx = Cmn.GetObj("qtyInp" + bxObj.PartNbrTxt);
            if (inpBx) {
                inpBx.focus();
            }
        }
        if (isInLnSpec(partNbrLnk)) {
            updtInlnSpecInteractions(bxObj.mWebPartObj);
        }
        mMainContentCntnr = Cmn.GetObj("MainContent");
        // Add the event listeners for the attribute menu. 			
        if (mMainContentCntnr) {
            var inLnBxRws = Cmn.GetElementsByClsNm("AddToOrdFlow_ItmBx", "tr", mMainContentCntnr);
            if (inLnBxRws && inLnBxRws.length > 2) {
                // Do nothing, the event listener will already have been added.
            } else {
                Cmn.RemEvntListener(mMainContentCntnr, "click", hndlClickEvnt);
                Cmn.AddEvntListener(mMainContentCntnr, "click", hndlClickEvnt);
            }
        } else {
            mCtlgShellCntnr = Cmn.GetObj("CtlgPageShell_CtlgPage_Cntnr");

            if (mCtlgShellCntnr) {
                // Check to make sure that there is not already another box loaded
                // since the event listener added with it handles all clicks.
                var inLnBxRws = Cmn.GetElementsByClsNm("AddToOrdFlow_ItmBx", "tr", mCtlgShellCntnr);
                if (inLnBxRws && inLnBxRws.length > 2) {
                    // Do nothing, the event listener will already have been added.
                } else {
                    Cmn.RemEvntListener(mCtlgShellCntnr, "click", hndlClickEvnt);
                    Cmn.AddEvntListener(mCtlgShellCntnr, "click", hndlClickEvnt);
                }
            }
        }
    }

    /// #End Region "Public Methods" 


    ///#Region "Private Methods"
	// <summary> 
	// Retrieve information about the part number
	// </summary>
	// <param name="intrnPartNbrTxt">
	// The internal part number text. This is used to query the database.
	// </param>
	var chkPartNbrExcludedForItmPrsnttn = function(bxObj, mainCntnr){
		var cnxnObj = {
			success: hndlPartNbrExcludeAjaxResp,
			cnxnParm: {
				respTyp: McMaster.CnxnMgr.WEB_PART_RESP_TYP_TXT,
				mMainCntnr: mainCntnr,
				mBxObjInstance: bxObj
			}
		};
		var ITM_PRSNTTN_UPDT_HTTP_HANDLER_URL = "/WebParts/Content/ItmPrsnttnDynamicDat.aspx";
        var url = ITM_PRSNTTN_UPDT_HTTP_HANDLER_URL + "?" +
					  ACT_TXT + "=" +
					  "partnumberexclude" + "&" +
					  PART_NBR_QS_KY_TXT + "=" +
                      bxObj.PartNbrTxt;
		McMaster.CnxnMgr.PerformAjaxCnxn(url, cnxnObj);	
	}
	
	// <summary> 
	// Retrieves additional content links for the select part number. 
	// </summary>
	// <param name="intrnPartNbrTxt">
	// The internal part number text. This is used to query the database.
	// </param>
	var hndlPartNbrExcludeAjaxResp = function (webPartObj, respArgs) {
	
		var attrnms = []
		  , attrvals = [];
		
		var mainCntnr = respArgs.mBxObjInstance.BxCntntRow;
		var bxObj = respArgs.mBxObjInstance;
		var partNbrExcludeInd = webPartObj.PartNbrExcludeInd;
		
		if (!mainCntnr){
			mainCntnr = mBxObj.MainCntnr;
		}
		
		var attrCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartAttrCntnr", "div", mainCntnr)[0]
		    cntnrRow = Cmn.GetAncestorByTagNm(mainCntnr, "tr");
		 
		if (typeof (attrCntnr) != "undefined") {
			var attrCntnrs = Cmn.GetChldrnBy(function (elem) { return Cmn.HasCls(elem, "InLnOrdWebPart_ChildAttrCntnr") }, attrCntnr)
				  , inpBx = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_AttrInpBx", "input", attrCntnr)[0]
				  , attrSlctCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartAttrCntnr", "div", mainCntnr)[0]
				  , attrSlcts = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrDropDwn", "div", attrSlctCntnr)
				  , attrCntnrMetaDat = attrSlctCntnr.attributes
			      , partNbrSeq = 0;

			//get sequence number from the attribute container. 
			//this sequence number is used to uniquely identify each instance of same part number 
			for (var i=0; i<attrCntnrMetaDat.length; i++){
				if (attrCntnrMetaDat[i].name == "data-mcm-partnbr-seqnbr"){
					partNbrSeq = attrCntnrMetaDat[i].value;
					break;
				}
			}

			// Collect the attribute names and values.
			for (var cntnrIdx = 0; cntnrIdx < attrCntnrs.length; cntnrIdx++) {
				var attrSlct = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrDropDwn", "div", attrCntnrs[cntnrIdx])[0]
				  , attrLst = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrForm", "ul", attrCntnrs[cntnrIdx])[0];

				if (attrSlct) {
					var id = attrSlct.id;
					if (partNbrSeq && partNbrSeq > 0){
						id = id + partNbrSeq;
					}
					
					if (mAttrbtSlctdTbl.Itm(id)) {
						attrnms[cntnrIdx] = attrSlct.id.split('&')[IDSTRARR_ATTRNAME_INDEX];
						attrvals[cntnrIdx] = getAttrVal(mAttrbtSlctdTbl.Itm(id));
						var attrSlctsInnerHTML = attrSlct.innerHTML;
						if (attrvals[cntnrIdx] == "Other") {
							attrvals[cntnrIdx] = inpBx.value;
						} else if (attrSlctsInnerHTML == 'Select from list...') {
							// No value for this attribute.
						}
					}
					else {
						// No value for this attribute.
					}
				} else if (attrLst) {
					var slctAttrRdoBtn = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrLstSlctd", "li", attrLst)[0];
					if (slctAttrRdoBtn) {
						attrnms[cntnrIdx] = attrLst.id;
                        attrvals[cntnrIdx] = getAttrVal(slctAttrRdoBtn.innerHTML);
                    } else {
                        // No value for this attribute.
                    }
                }
            }
        }
        // Assemble attribute name and value query strings.
        var attrNmsQSTxt = attrnms.join(String.fromCharCode(2029))
			  , attrValsQSTxt = attrvals.join(String.fromCharCode(2029));
		var cnxnObj = {
			success: hndlAddnlCntntLnksAJAXResp,
			cnxnParm: {
				respTyp: McMaster.CnxnMgr.WEB_PART_RESP_TYP_TXT,
				PartNbrTxt: bxObj.PartNbrTxt,
				cntntRow: mainCntnr
			}
		};

        var url = INLN_ORD_HTTP_HANDLER_URL + "?" +
					  ACT_TXT + "=" +
					  GET_ADDNL_CNTNT_LNKS_QS_KY_TXT + "&" +
					  INTRN_PART_NBR_QS_KY_TXT + "=" +
					  bxObj.PartNbrMetaDat.IntrnPartNbrTxt + "&" +
					  PART_NBR_QS_KY_TXT + "=" +
                      bxObj.PartNbrTxt + "&" +
                      ATTR_NM_QS_KY_TXT + "=" +
                      encodeURIComponent(attrNmsQSTxt) + "&" +
                      ATTR_VAL_QS_KY_TXT + "=" +
                      encodeURIComponent(attrValsQSTxt) + "&" +
					  "partnumberexclude" + "=" + 
					  partNbrExcludeInd;
					  

        //add more information to the query string
        if (isInLnSpec(bxObj.PartNbrLnk)) {
            var partNbrLnk = bxObj.PartNbrLnk;
            var attrCompItmIds = partNbrLnk.getAttribute("data-mcm-attr-comp-itm-ids");
            var fullPrsnttnId = getFullPrsnttnId(partNbrLnk);
            var prsnttnId = getPrsnttnId(partNbrLnk); //part number link may exist in either sub or full

            url = url + "&" +
					  FULL_PRSNTTN_ID_KY_TXT + "=" +
					  fullPrsnttnId + "&" +
					  PRSNTTN_ID_KY_TXT + "=" +
					  prsnttnId + "&" +
					  IS_INLNSPEC + "=" +
					  true + "&" +
					  ATTR_COMP_IDS + "=" +
					  attrCompItmIds;

			var inLnSpecInpDict = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.InLnSpecUsrInps.KyTxt());
			if (inLnSpecInpDict) {
				
				var InLnSpecId = bxObj.PartNbrTxt + '_' + prsnttnId;
				if (partNbrSeq && partNbrSeq > 0){
					InLnSpecId = InLnSpecId + '_' + partNbrSeq;
				}
				if (InLnSpecId  in inLnSpecInpDict) {
					url = inLnSpecInpDict[InLnSpecId].AddSpecUsrInpQS(url);
				}
			}
		}
		
		//for the server to decide if we build the inlnordwebpart with proddetaillnk 
		var prodDetLnkActvnInd = "0";
		var inSesnInd = McMaster.SesnMgr.ContainsStValKy(McMaster.SesnMgr.StValDefs.ProdDetLnkActvnInd.KyTxt());
		if (inSesnInd == true) {
			prodDetLnkActvnInd = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.ProdDetLnkActvnInd.KyTxt());
		}
		if (prodDetLnkActvnInd) {
			url = url + "&" + PROD_DET_LNK_ACTVN_IND_QS_KY_TXT + "=" + prodDetLnkActvnInd;
			
			var msgHdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.INLN_ORD);
			var msg = new McMaster.MsgMgrMsgs.ItmPrsnttnFetchAhead(msgHdr, bxObj.PartNbrTxt, attrCompItmIds);
			McMaster.MsgMgr.PubMsg(msg);
		}
		McMaster.CnxnMgr.PerformAjaxCnxn(url, cnxnObj);	
	}
	
    var hndlOrdHistAJAXResp = function (webPartObj, respArgs) {
        /// <summary>
        /// The success function that gets executed when the call to 
        /// get the order history completes. 
        /// </summary>
        /// <param name="webPartObj">The web part object.</param>
        /// <param name="respArgs">
        /// The arguments that we specified in the connection object - here, it is just the part number. 
        /// </param>

        if (webPartObj) {
            // find the order history message container.
            var actvBx = mBxObj
				  , ordHistMsgCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartOrdHistMsg" + respArgs.bxObj.PartNbrTxt, 'div', respArgs.bxObj.BxCntntRow)[0];

            // try to get data out of the sales workstation object in session.
            var msgDat = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.FndAgainSlsWrkStObj.KyTxt());
            // load order history message into the container.

            if (ordHistMsgCntnr) {
                //ordHistMsgCntnr.innerHTML = webPartObj.MarkupTxt + ".";
                if (msgDat == null || msgDat == "NONE" || msgDat.length < 1) {
                    // check if we have information from the sales workstation
                    if (webPartObj.MarkupTxt.length > 0) {
                        ordHistMsgCntnr.innerHTML = webPartObj.MarkupTxt + ".";
                        Cmn.ReplaceCls(ordHistMsgCntnr, "Hide", "InLnOrdWebPartLayout_OrdHistMsg");
                        actvBx.OrdHistMsgTxt = webPartObj.MarkupTxt;
                    }
                } else {
                    // Use Sales Workstation data to build the 
                    // Order History message text.	
                    var msgTxt = bldOrdHistMsgForSlsWrkst(webPartObj, msgDat, actvBx);
                    if (msgTxt.length > 0) {
                        ordHistMsgCntnr.innerHTML = msgTxt + ".";
                        Cmn.ReplaceCls(ordHistMsgCntnr, "Hide", "InLnOrdWebPartLayout_OrdHistMsg");
                        actvBx.OrdHistMsgTxt = msgTxt;
                    }
                }
                setVal(valDefs.ActvInLnOrdBx.KyTxt(), actvBx);
            }

        } else {
            // Do nothing. TODO: Figure out some kind of default behavior for not getting a 
            // response.
        }
    }
    // --------------------------------------------------------------
    // Summary: If the web site is embedded in the Sales Workstation,
    // 			we need to manually build the Order History Message.
    // --------------------------------------------------------------
    var bldOrdHistMsgForSlsWrkst = function (webPartObj, msgDat, actvBx) {
        var singularPartNbrUMTxt = webPartObj.CtlgSellSingularUMTxt
			, pluralPartNbrUMTxt = webPartObj.CtlgSellPluralUMTxt
			, msgTxt
			, qty
			, lastOrdTs
			, poTxt
			, actvPartNbr = actvBx.PartNbrTxt
			, clickedOrdPartNbr = {};

        if (msgDat[actvPartNbr]) {

            clickedOrdPartNbr = msgDat[actvPartNbr];
            qty = clickedOrdPartNbr.qty;
            poTxt = clickedOrdPartNbr.PO;
            lastOrdTs = clickedOrdPartNbr.lastOrdTs;


            msgTxt = qty + ' ';
            if (qty > 1) {
                msgTxt = msgTxt + pluralPartNbrUMTxt + ' ' + 'were' + ' ';
            } else {
                msgTxt = msgTxt + singularPartNbrUMTxt + ' ' + 'was' + ' ';
            }
            msgTxt = msgTxt + 'ordered' + ' ' + lastOrdTs + ' ' + poTxt;
        }


        return msgTxt;
    }

    // <summary>
    // The success function that gets executed when the call to 
    // get the additional content completes. 
    // </summary>
    // <param name="webPartObj">The web part object.</param>
    // <param name="respArgs">
    // The arguments that we specified in the connection object - here, 
    // it is just the part number and the content row. 
    // </param>
    var hndlAddnlCntntLnksAJAXResp = function (webPartObj, respArgs) {
        mBxObj.ProdSpecLnkTxt = webPartObj.ProdSpecLnkMarkupTxt;

        if (webPartObj) {
            // Find the link container.
            var lnkCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPart_Hdr", 'div', respArgs.cntntRow)[0]
				  , addcntntlnkcntnr = Cmn.GetElementsByClsNm("MsdsSpan", 'span', respArgs.cntntRow)[0]
				  , actvBx = mBxObj;
            if (lnkCntnr) {
                var mainCntCntnr = Cmn.GetNxtSiblingBy(lnkCntnr, function (elem) { return Cmn.HasCls(elem, "InLnOrdWebPartLayout_Main") })
					  , dscCntnr = Cmn.GetElementBy(function (elem) { return Cmn.HasCls(elem, "InLnOrdWebPart_ItmDsc") }, "div", mainCntCntnr)
					  , prodSpecCntnrs = Cmn.GetElementsByClsNm("InLnOrdWebPart_ProdSpecLnk", "div", mainCntCntnr);

                // Load the new links into the link container					
                addcntntlnkcntnr.innerHTML = webPartObj.MarkupTxt;
                actvBx.MSDSLnkTxt = webPartObj.MarkupTxt;
                mBxObj.MarkupTxt = webPartObj.MarkupTxt;
                mBxObj.MSDSLnkTxt = webPartObj.MarkupTxt;

                // Load the prod spec link if one exists at the end of the description.
                if (actvBx.ProdSpecLnkTxt.length <= 0) {
                    // Do nothing as there is no prod spec link.
                } else {
                    dscCntnr.innerHTML = actvBx.PartNbrMetaDat.Dsc + webPartObj.ProdSpecLnkMarkupTxt;
                    actvBx.ProdSpecLnkTxt = webPartObj.ProdSpecLnkMarkupTxt;
                }
            }

            setVal(valDefs.ActvInLnOrdBx.KyTxt(), actvBx);

        }
    }

    var hndlAddToOrdAJAXResp = function (webPartObj, respArgs) {
        /// <summary>
        /// The success function that gets executed when the call to 
        /// get the additional content completes. 
        /// </summary>
        /// <param name="webPartObj">The web part object.</param>
        /// <param name="respArgs">
        /// The arguments that we specified in the connection object - here, it is just the part number. 
        /// </param>

        // The indicator is set to true once the success method has completed. Needs to be
        // set to false in order to execute another AJAX call.
        mReadyNxtAjaxCallInd = true;

        // Reset the attribute error indicator to false. 
        mAttrErrInd = false;

        if (webPartObj) {
            // Get the inline order main container. 
            var inLnOrdMainCntnr = respArgs.mainCntnr;
            var partNbrTxt = respArgs.PartNbrTxt;
			var isInLnSpecInd = respArgs.isInLnSpecInd;

            if (inLnOrdMainCntnr) {
                var inpBx = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_InpBx", "input", inLnOrdMainCntnr)[0];
				var notMsgCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_ItmNotes", "div", inLnOrdMainCntnr)[0];
				var warningMsgCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_WarningAlert", "div", inLnOrdMainCntnr)[0];
                var qtyErrCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_QtyErr", "div", inLnOrdMainCntnr)[0];
				
				if (isInLnSpecInd == true && warningMsgCntnr.innerHTML.length > 0) {
					Cmn.AddCls(warningMsgCntnr, "InLnOrdWebPartLayout_BoldedWarningAlert");
				}
				if (isInLnSpecInd == true && webPartObj.WarningMsg.length > 0) {
					// display warning text
					Cmn.AddCls(warningMsgCntnr, "InLnOrdWebPartLayout_BoldedWarningAlert");
					warningMsgCntnr.innerHTML = webPartObj.WarningMsg;
					InLnOrdWebPart.ScrollToShowInLnOrdCntnr();
					Cmn.TrkAct("InLnOrdAttrErr&partnbr=" + partNbrTxt, "InLnOrd");
				} else if (webPartObj.QtyErrMsg.length > 0) {
					// display qty warning text
					qtyErrCntnr.innerHTML = webPartObj.QtyErrMsg;
					Cmn.ReplaceCls(qtyErrCntnr, "Hide", "Show");
					inpBx.select();
					InLnOrdWebPart.ScrollToShowInLnOrdCntnr();
					Cmn.TrkAct("InLnOrdQtyPck&partnbr=" + partNbrTxt, "InLnOrd");
				} else if (webPartObj.AvailLensErrInd) {
					// Check the error message indicators
					// There was either a standard pack or available length error.
					// Bold the notes text that contains that information.
					if (notMsgCntnr) {
						Cmn.ReplaceCls(notMsgCntnr, "Hide", "Show");
						inpBx.focus();
						Cmn.TrkAct("InLnOrdInvldQtyErr&partnbr=" + partNbrTxt, "InLnOrd");
					}
				} else if (webPartObj.FirmPkErrInd) {
					// This item is sold in a firm package and the customer entered a quantity
					// that breaks the package. Show an error message.
					qtyErrCntnr.innerHTML = "This product is sold in packs of " + mMetaDat.SellStdPkgQty + ".";
					Cmn.ReplaceCls(qtyErrCntnr, "Hide", "Show");
					inpBx.select();
					InLnOrdWebPart.ScrollToShowInLnOrdCntnr();
					Cmn.TrkAct("InLnOrdQtyPck&partnbr=" + partNbrTxt, "InLnOrd");
				} else {
					// Create the order lines updated message. 
					var msgHdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.INLN_ORD);
					var ordLnsUpdtdMsg = new McMaster.MsgMgrMsgs.OrdLnsUpdated(msgHdr);
					var inLnBxCntnr = Cmn.GetAncestorByClsNm(inLnOrdMainCntnr, "AddToOrdFlow_ItmBxFor" + mBxObj.Id)
					Cmn.AddCls(inLnBxCntnr, "InLnOrdWebPart_ItmAdded");

					// Replace the content of the inline box with the confirmation message. 
					inLnOrdMainCntnr.innerHTML = webPartObj.MarkupTxt;
					Cmn.AddCls(inLnOrdMainCntnr, "InLnOrdWebPartLayout_ItmAddedMsg");

					// Publish the order lines updated message. 
					McMaster.MsgMgr.PubMsg(ordLnsUpdtdMsg);

					Cmn.TrkAct("InLnOrdAddtoOrd&partnbr=" + partNbrTxt + "&AutoSlctdPartNbrInd=" + mBxObj.mWebPartObj.AutoSlctdPartNbrInd, "InLnOrd");
					
					// TrkSrch
					var srchTrkInfo = new SrchTrkr.SrchDat({ usr: SrchTrkr.UsrActTyps.SLCT });
					srchTrkInfo.usr.srcNm = "InLnOrdWebPart";
					srchTrkInfo.usr.elemTyp = SrchTrkr.ElemTyps.ADD_TO_ORD_BTN;
					srchTrkInfo.usr.slctdNm = decodeURIComponent(partNbrTxt);
					srchTrkInfo.usr.entryTxt = decodeURIComponent(inpBx.value);
				    srchTrkInfo.Trk();
				}
			}
        }
    };

    var hndlFailedAddToOrdAjaxResp = function () {
        /// <summary>
        /// Resets the ajax call indicator to true upon a server failure. 
        /// Resets the attribute error indicator to false upon a server failure. 
        /// </summary>
        mReadyNxtAjaxCallInd = true;
        mAttrErrInd = false;
    }

    var hndlUpdtAttrAjaxResp = function (webPartObj, respArgs) {
        /// <summary>
        /// The success function that gets executed when the call to 
        /// update the items attributes.
        /// </summary>
        /// <param name="webPartObj">The web part object.</param>
        /// <param name="respArgs">
        /// The arguments that we specified in the connection object - here, it is just the part number. 
        /// </param>

		//get active element for setting focus
		var active = document.activeElement, 
		activeId = null,
		activeIsQty = false;
		
		if (active.className == "OtherValInpBx") {
			activeId = Cmn.GetAncestorByClsNm(active, "SpecSrch_Attribute").id;
		} else if (active.className == "InLnOrdWebPartLayout_InpBx") {
			activeIsQty = true;
		}
		
        updtStkMsg(webPartObj, respArgs); 

		if (webPartObj.IntrnPartNbrTxt.length > 0) {
			Me.GetAddnlCntntLnks(mBxObj, respArgs.inLnBxMainCntnr);
		}
		
		var parentRow,
			bxCntntRow,
			specCntnr;

		if (respArgs.ClickedElem) {
			specCntnr = getSpecCntnr(respArgs.ClickedElem, respArgs.PartNbrTxt);
		}
		
		var envr = Cmn.GetApplEnvrPrfx() + Cmn.GetApplEnvrSfx();
		//Retrieves the inline attribute container 
		if (chkCtlgPageInd()) {
			if(!(specCntnr)) {
				var mainIFrame = document.getElementById("MainIFrame");
				var ctlgPageElem = getObjFrmIFrameById(mainIFrame, "Catalog");
				specCntnr = getObjFrmIFrameById(ctlgPageElem, "InLnOrdWebPart_SpecCntnr" + "_" + respArgs.PartNbrTxt);
			}
			if(!(specCntnr)){
				specCntnr = Cmn.Get("InLnOrdWebPart_SpecCntnr" + "_" + respArgs.PartNbrTxt);
			}
			if (specCntnr) {
			
				//remove event listeners that exist on old input boxes
				//Chrome is sensitive and otherwise will attend to event listeners that no longer exist
				var mainBx = Cmn.GetAncestorByClsNm(specCntnr, "InLnOrdWebPartLayout_Main")
				var qtyInpBx = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_InpBx", "input", mainBx);
				var inpBxs = Cmn.GetElementsByClsNm("OtherValInpBx", "input", specCntnr);
				var sizedInpBx = Cmn.GetElementsByClsNm("SizedInpBx", "textarea", specCntnr)[0];
				
				if (qtyInpBx && qtyInpBx[0]) {
					Cmn.RemEvntListener(qtyInpBx[0], "keyup");
				}
				
				for (var i = 0; i < inpBxs.length; i++) {
					Cmn.RemEvntListener(inpBxs[i], "blur");
				}
				
				if (sizedInpBx){
					Cmn.RemEvntListener(sizedInpBx,"keydown",function(e){InLnOrdWebPart.HndlEvntOnKeyDown(e, webPartObj)});
					Cmn.RemEvntListener(sizedInpBx,"keypress",function(e){InLnOrdWebPart.HndlKeyPressEvnt(e,webPartObj);});
					Cmn.RemEvntListener(sizedInpBx,"paste",function(e){InLnOrdWebPart.HndlPasteEvnt(e,webPartObj);});
					Cmn.RemEvntListener(sizedInpBx,"blur",function(e){InLnOrdWebPart.HndlBlurEvnt(e,webPartObj);});
				}
				
				//Reset the markuptxt
				specCntnr.innerHTML = webPartObj.MarkupTxt;
				
				//The markup txt does not contain whatever was in the input boxes. We need to repopulate these boxes on the client.
				var attrnms = respArgs.AttrNms;
				var attrvals = respArgs.AttrVals;
				
				var otherInpBxs = Cmn.GetElementsByClsNm("OtherValInpBx", "input", specCntnr);
				if (otherInpBxs) {
					for (var i = 0; i < otherInpBxs.length; i++) {
						var divId = Cmn.GetAncestorByClsNm(otherInpBxs[i], "SpecSrch_Attribute").id;
						var attrIdArray = divId.split("_");
						if (attrnms.length > 0) {
							for (var j = 0; j < attrnms.length; j++) {
								if (attrnms[j] == attrIdArray[PUB_ATTR_ID_IDX]) {
									otherInpBxs[i].value = attrvals[j];
								}
							}
						}
					}
				}
				//inner html has been modified. must re-define box elem and reattach listeners
				sizedInpBx = Cmn.GetElementsByClsNm("SizedInpBx", "textarea", specCntnr)[0];
				sizedInpBx = Cmn.GetElementsByClsNm("SizedInpBx", "textarea", specCntnr)[0];
				if (sizedInpBx){
					attrnms[attrnms.length] = "Custom";
					if (respArgs.ClickedElem){
						sizedInpBx.value = respArgs.ClickedElem.value;
					}
				}
			}
		} else {
			if(!(specCntnr)){
				specCntnr = Cmn.Get("InLnOrdWebPart_SpecCntnr" + "_" + respArgs.PartNbrTxt);
			}
			if (specCntnr) {
			
				//remove event listeners that exist on old input boxes
				//Chrome is sensitive and otherwise will attend to event listeners that no longer exist
				var mainBx = Cmn.GetAncestorByClsNm(specCntnr, "InLnOrdWebPartLayout_Main")
				var qtyInpBx = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_InpBx", "input", mainBx);
				var inpBxs = Cmn.GetElementsByClsNm("OtherValInpBx", "input", specCntnr);
				var sizedInpBx = Cmn.GetElementsByClsNm("SizedInpBx", "textarea", specCntnr)[0];
				
				if (qtyInpBx && qtyInpBx[0]) {
					Cmn.RemEvntListener(qtyInpBx[0], "keyup");
				}
				
				for (var i = 0; i < inpBxs.length; i++) {
					Cmn.RemEvntListener(inpBxs[i], "blur");
				}
				
				if (sizedInpBx){
					Cmn.RemEvntListener(sizedInpBx,"keydown",function(e){InLnOrdWebPart.HndlEvntOnKeyDown(e, webPartObj)});
					Cmn.RemEvntListener(sizedInpBx,"keypress",function(e){InLnOrdWebPart.HndlKeyPressEvnt(e,webPartObj);});
					Cmn.RemEvntListener(sizedInpBx,"paste",function(e){InLnOrdWebPart.HndlPasteEvnt(e,webPartObj);});
					Cmn.RemEvntListener(sizedInpBx,"blur",function(e){InLnOrdWebPart.HndlBlurEvnt(e,webPartObj);});
				}
				
				//Reset the markuptxt
				specCntnr.innerHTML = webPartObj.MarkupTxt;
				
				//The markup txt does not contain whatever was in the new input boxes. We need to repopulate these boxes on the client.
				var attrnms = respArgs.AttrNms;
				var attrvals = respArgs.AttrVals;
				
				var otherInpBxs = Cmn.GetElementsByClsNm("OtherValInpBx", "input", specCntnr);
				if (otherInpBxs) {
					for (var i = 0; i < otherInpBxs.length; i++) {
						var divId = Cmn.GetAncestorByClsNm(otherInpBxs[i], "SpecSrch_Attribute").id;
						var attrIdArray = divId.split("_");
						if (attrnms.length > 0) {
							for (var j = 0; j < attrnms.length; j++) {
								if (attrnms[j] == attrIdArray[PUB_ATTR_ID_IDX]) {
									otherInpBxs[i].value = attrvals[j];
								}
							}
						}
					}
				}
				//inner html has been modified. must re-define box elem and reattatch listeners
				sizedInpBx = Cmn.GetElementsByClsNm("SizedInpBx", "textarea", specCntnr)[0];
				if (sizedInpBx){
					attrnms[attrnms.length] = "Custom";
					if (respArgs.ClickedElem){
						sizedInpBx.value = respArgs.ClickedElem.value;
					}
				}
				
			} 
		}

		//Place the focus on either the contextual search box or the quantity box or the sized input box
		if (Cmn.GetElementsByClsNm("SpecSrch_CntxtSrchBx", "input", specCntnr)[0] ||
			Cmn.GetElementsByClsNm("SizedInpBx","textarea", specCntnr)[0]) {
			var inpBx = Cmn.GetElementsByClsNm("SpecSrch_CntxtSrchBx", "input", specCntnr)[0] ?
				Cmn.GetElementsByClsNm("SpecSrch_CntxtSrchBx", "input", specCntnr)[0] :
				Cmn.GetElementsByClsNm("SizedInpBx","textarea", specCntnr)[0];
			//SpecSrchWebPart.MaintainFocus.SavePosn(inpBx)
			if (inpBx) {
				if (inpBx.setSelectionRange) {
					inpBx.focus();
					inpBx.setSelectionRange(inpBx.value.length, inpBx.value.length);
				} else if (inpBx.createTextRange) {
					// IE
					var range = inpBx.createTextRange();
					range.collapse(true);
					range.moveEnd('character', inpBx.value.length);
					range.moveStart('character', inpBx.value.length);
					range.select();
				}
			}
			if (Cmn.HasCls(inpBx, "SizedInpBx")){
				Cmn.AddEvntListener(sizedInpBx,"blur",function(e){InLnOrdWebPart.HndlBlurEvnt(e,webPartObj)});
			}
			
		} else if (Cmn.GetElementsByClsNm("OtherValInpBx", "input", specCntnr)[0]) {
			
			var clickedElem = respArgs.ClickedElem;
			if (clickedElem && clickedElem.innerHTML == OTHER_VAL_TXT) {
				var iDArray = clickedElem.id.split("_");
				var attributeElems = Cmn.GetElementsByClsNm("SpecSrch_Attribute", "div", specCntnr);			
				for (var i = 0; i < attributeElems.length; i++) {
					var attributeIDArray = attributeElems[i].id.split("_");
					if (iDArray[PUB_ATTR_ID_IDX] == attributeIDArray[PUB_ATTR_ID_IDX]) {			
						var inpBx = Cmn.GetElementsByClsNm("OtherValInpBx", "input", attributeElems[i]);
						if (inpBx) {
							inpBx[0].focus();
						}
					}
				}
			} else {
				if (activeId) {
					var activeAttrCntnr = Cmn.Get(activeId);
					var activeInpBxs = Cmn.GetElementsByClsNm("OtherValInpBx", "input", activeAttrCntnr);
					if (activeAttrCntnr && activeInpBxs[0]) {
						activeInpBxs[0].focus();
					}
				} else if (activeIsQty) {
					var qtyInpBx = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_InpBx", "input", specCntnr);
					if (qtyInpBx && qtyInpBx[0]) {
						qtyInpBx[0].focus();
					}
				}
			}
			
			Cmn.RemEvntListeners(inpBx, "blur");
			Cmn.RemEvntListeners(inpBx, "focus");
			var qtyErrCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_QtyErr", "div", bxCntntRow)[0];
			Cmn.ReplaceCls(qtyErrCntnr, "Show", "Hide");
			
			var inpBxs = Cmn.GetElementsByClsNm("OtherValInpBx", "input", specCntnr);

			for (var i = 0; i < inpBxs.length; i++) {
				Cmn.AddEvntListener(inpBxs[i], "blur", function (e) {
					InLnOrdWebPart.HndlKeyDownEvnt(e, webPartObj, respArgs);
				});
			}
			
			// For titled input boxes on products with multiple price levels, refresh the box
			// after every keystroke in the quantity box, as the price level may have changed
			if (inpBxs.length > 0 && webPartObj.IsTieredPrceInd) {
				var mainBx = Cmn.GetAncestorByClsNm(specCntnr, "InLnOrdWebPartLayout_Main")
				var qtyInpBx = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_InpBx", "input", mainBx);
				if (qtyInpBx && qtyInpBx[0]) {
					Cmn.AddEvntListener(qtyInpBx[0], "keyup", function (e) {
						InLnOrdWebPart.HndlKeyDownEvnt(e, webPartObj, respArgs);
					});
				}
			}
			
		} else {
			//do nothing
		}

	};
	
	var getSpecCntnr = function (elem, partNbrTxt) {
		var rtnElem;
		var tempMthd = function (e) {
			var rtnVal = false;
			if (e.id == "InLnOrdWebPart_SpecCntnr" + "_" + partNbrTxt) {
				rtnVal = true;
			}
			return rtnVal;
		}
		
		if (elem) {
			rtnElem = Cmn.GetAncestorBy(elem, tempMthd);
		}
		
		return rtnElem;
	};

    var getOrdHistMsg = function (webPartObj, respArgs) {
        /// <summary>
        /// The function that fetches order history when the call 
        /// to update the item attributes is made.
        /// </summary>
        /// <param name="webPartObj">The web part object.</param>
        /// <param name="respArgs">
        /// The part number and the ordhistmsg container. 
        /// </param>

        if (webPartObj) {
            // find the order history message container.
            var actvBx = mBxObj
				  , ordHistMsgCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartOrdHistMsg" + respArgs.PartNbrTxt, 'div', respArgs.inLnBxMainCntnr)[0];

            // try to get data out of the sales workstation object in session.
            var msgDat = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.FndAgainSlsWrkStObj.KyTxt());
            // load order history message into the container.

            if (ordHistMsgCntnr) {
                //ordHistMsgCntnr.innerHTML = webPartObj.MarkupTxt + ".";
                if (msgDat == null || msgDat == "NONE" || msgDat.length < 1) {
                    // check if we have information from the sales workstation
                    if (webPartObj.MarkupTxt.length > 0) {
                        ordHistMsgCntnr.innerHTML = webPartObj.MarkupTxt + ".";
                        Cmn.ReplaceCls(ordHistMsgCntnr, "Hide", "InLnOrdWebPartLayout_OrdHistMsg");
                        actvBx.OrdHistMsgTxt = webPartObj.MarkupTxt;
                    }
                } else {
                    // Use Sales Workstation data to build the 
                    // Order History message text.	
                    var msgTxt = bldOrdHistMsgForSlsWrkst(webPartObj, msgDat, actvBx);
                    if (msgTxt.length > 0) {
                        ordHistMsgCntnr.innerHTML = msgTxt + ".";
                        Cmn.ReplaceCls(ordHistMsgCntnr, "Hide", "InLnOrdWebPartLayout_OrdHistMsg");
                        actvBx.OrdHistMsgTxt = msgTxt;
                    }
                }
                setVal(valDefs.ActvInLnOrdBx.KyTxt(), actvBx);
            }

        } else {
            // Do nothing. TODO: Figure out some kind of default behavior for not getting a 
            // response.
        }

    };

    // <summary>
    // update stock message
    // </summary>
    // <param name="webPartObj">The web part object.</param>
    // <param name="respArgs">
    // The arguments that we specified in the connection object - here, it is just the part number. 
    // </param>
    var updtStkMsg = function (webPartObj, respArgs, inpVal) {
        var stkmsgcntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_StkMsg", "div", respArgs.inLnBxMainCntnr)[0];
        if (!stkmsgcntnr) {
            //look for cntnr with alternate class name
            stkmsgcntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_StkMsgPacks", "div", respArgs.inLnBxMainCntnr)[0];
        }
        var cntntRow = Cmn.GetAncestorByTagNm(respArgs.inLnBxMainCntnr, "tr");
        var stkMsg = webPartObj.StkMsgTxt;
		var warningMsgCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_WarningAlert", "div", respArgs.inLnBxMainCntnr)[0];
		
		if (warningMsgCntnr) {
			Cmn.RemCls(warningMsgCntnr, "InLnOrdWebPartLayout_BoldedWarningAlert");
			warningMsgCntnr.innerHTML = webPartObj.WarningMsg;
			if (warningMsgCntnr.innerHTML.length > 0) {
				stkmsgcntnr.innerHTML = "";
			} else {
			
				//Add the new stock message into the stock message container.						
				if (stkmsgcntnr) {
					stkmsgcntnr.innerHTML = stkMsg;
				}
				//Add the price into the price container, which will be in a different location 
				//depending upon the customers preference for viewing product information.
				var prceTxtCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_PrceTxt", "div", respArgs.inLnBxMainCntnr)[0];
				var expdViewPrceTxtCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayoutExpdView_PrceCell", "div", respArgs.inLnBxMainCntnr)[0];

				//If the customer wants expanded product information in the inline box and the pricing div exists
				//insert the price text. 
				if (webPartObj.IsExpdFrmtInd && expdViewPrceTxtCntnr) {
					//If the item has tiered pricing, we don't want to replace that with the price text from 
					//the server so do nothing.
					if (webPartObj.IsTieredPrceInd) {
						//Do nothing
					} else if (webPartObj.PrceTxt == "") {
						// Do nothing. 
					} else {
						//Insert the price text from the server below the item's description.
						expdViewPrceTxtCntnr.innerHTML = "$" + webPartObj.PrceTxt + webPartObj.UMTxt;
					}
				} else {
					if (prceTxtCntnr) {
						if (webPartObj.PrceTxt == "") {
							// Do nothing. 
						} else {
							prceTxtCntnr.innerHTML = "$" + webPartObj.PrceTxt;
						}
					}
				}
			}
		} else {
		
			var attrErrCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_AttrAlert", "div", respArgs.inLnBxMainCntnr)[0];
			//var otherErrCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_OtherChoiceAlert", "div", respArgs.inLnBxMainCntnr)[0];
			
			if (attrErrCntnr) {
				attrErrCntnr.outerHTML = webPartObj.AttrWarningMsg;
				//Cmn.ReplaceCls(attrErrCntnr, "Hide", "Show");
				//InLnOrdWebPartDynamicRendering.js and Me.AddtoOrd deal with whether to show this or not.
			} //Don't want to show stock if attributes are missing.						
			
			//Add the new stock message into the stock message container.						
            if (stkmsgcntnr) {
                stkmsgcntnr.innerHTML = stkMsg;
            }
            //Add the price into the price container, which will be in a different location 
            //depending upon the customers preference for viewing product information.
            var prceTxtCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_PrceTxt", "div", respArgs.inLnBxMainCntnr)[0];
            var expdViewPrceTxtCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayoutExpdView_PrceCell", "div", respArgs.inLnBxMainCntnr)[0];

            //If the customer wants expanded product information in the inline box and the pricing div exists
            //insert the price text. 
            if (webPartObj.IsExpdFrmtInd && expdViewPrceTxtCntnr) {
                //If the item has tiered pricing, we don't want to replace that with the price text from 
                //the server so do nothing.
                if (webPartObj.IsTieredPrceInd) {
                    //Do nothing
                } else if (webPartObj.PrceTxt == "") {
                    // Do nothing. 
                } else {
                    //Insert the price text from the server below the item's description.
                    expdViewPrceTxtCntnr.innerHTML = "$" + webPartObj.PrceTxt + webPartObj.UMTxt;
                }
            } else {
                if (prceTxtCntnr) {
                    prceTxtCntnr.innerHTML = "$" + webPartObj.PrceTxt;
                }
            }
			
		}
    }

    var hndlFailedUpdtAttrAjaxResp = function () {
        /// <summary>
        /// Resets the ajax call indicator to true upon a server failure. 
        /// </summary>
        mReadyNxtAjaxCallInd = true;
    }

    var hndlClickEvnt = function (e) {
        /// <summary>
        /// Handles the clicking event in the box
        /// </summary>
        /// <param name="e">The element clicked.</param>
        /// </param>

        //Make sure we have an event.
        if (e) {
            // Get the target element.
            var targetElem = Cmn.GetEvntTarget(e);

			if (Cmn.HasCls(targetElem, "InLnOrdWebPartLayout_AttrLstItm")) {
				// click was on list item so get value and call attribute change function.
				var drpDwnMenuCntnr = Cmn.GetAncestorByTagNm(targetElem, 'div');
				var drpDwnCntnr = Cmn.GetPrevSibling(Cmn.GetPrevSibling(drpDwnMenuCntnr));
				var inpBxs = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_AttrInpBx", "input", parentAttrCntnr);
				// Get the full attribute display text
				var drpDwnCntnrDsplyTxt = targetElem.innerHTML;
				// Get the uniquely identifying id
				var id = drpDwnCntnr.id;
				var attrCntnr = Cmn.GetAncestorByClsNm(drpDwnMenuCntnr,"InLnOrdWebPartLayout_AttrsCntnr");
				// if same part number appears more than once within a single presentation, 
				// we want to uniquely identify each instance by extracting the sequence 
				// in which the part number appears. By adding this sequence number, 
				// the id is actually unique. 
				// For example, look at "Maintenance-Free Ball Bearing Carriages and Guide Rails
				var seqNbr = 0;
				if (attrCntnr){
					var attrCntnrMetaDats = attrCntnr.attributes;
					for (var i = 0; i < attrCntnrMetaDats.length; i++){
						if (attrCntnrMetaDats[i].name == "data-mcm-partnbr-seqnbr"){
							seqNbr = attrCntnrMetaDats[i].value;
							break;
						}
					}
				}
				//concat id and the sequence number 
				if (seqNbr && seqNbr > 0){
					id = id + seqNbr;
				}
				// Remove any values previously associated with this id
				mAttrbtSlctdTbl.Rem(id);
				// Add the part number/attribute name (key) and selected attribute (val) to the hash table
				mAttrbtSlctdTbl.Add(id, drpDwnCntnrDsplyTxt);
				// Get the ruler element
				var rulerElem = Cmn.GetPrevSibling(Cmn.GetAncestorByTagNm(targetElem, 'div'));
				// Get the width of the selected attribute
				var drpDwnCntnrDsplyTxtWidth = getTxtWdth(rulerElem, drpDwnCntnrDsplyTxt);
				// Get the width of the dropdown
				var drpDwnWdth = Cmn.GetWidth(drpDwnCntnr);
				// Check if the selected attribute is wider than the dropdown width minus the space on the right
				// side of the dropdown that is taken up by the arrow and a buffer
				if (drpDwnCntnrDsplyTxtWidth > (drpDwnWdth - DRP_DWN_RT_SD_WDTH)) {
					while ((drpDwnCntnrDsplyTxtWidth + ELLPSS_WDTH) > (drpDwnWdth - DRP_DWN_RT_SD_WDTH)) {
						// Trim a character until the attribute text + an ellipsis fits in the dropdown
						drpDwnCntnrDsplyTxt = drpDwnCntnrDsplyTxt.substring(0, drpDwnCntnrDsplyTxt.length - 1);
						drpDwnCntnrDsplyTxtWidth = getTxtWdth(rulerElem, drpDwnCntnrDsplyTxt);
					}
					// If the last character is a space, get rid of it
					if (drpDwnCntnrDsplyTxt.charAt(drpDwnCntnrDsplyTxt.length - 1) == " ") {
						drpDwnCntnrDsplyTxt = drpDwnCntnrDsplyTxt.slice(0, -1);
					}
					else {
						// Do nothing
					}
					// Set the displayed text to the trimmed attribute plus an ellipsis
					drpDwnCntnr.innerHTML = drpDwnCntnrDsplyTxt + "...";
				}
				else {
					// The attribute already fits so don't trim anything. Just set the displayed text to the attribute.
					drpDwnCntnr.innerHTML = drpDwnCntnrDsplyTxt;
				}

                // Hide the attribute containers. 
                hideAttrMenu();

                // Call the attribute change function
                var idStrArr = drpDwnCntnr.id.split('&');
                AttrChng(targetElem);

                // Put focus in the "please specify" input box. 
                if (inpBxs.length > 0) {
                    inpBxs[0].focus();
                }

            } else if (Cmn.HasCls(targetElem, "InLnOrdWebPart_AttrDropDwn")) {

                // Check if the click was on an unopened box, if so then open it.
                // If click was on a drop-down menu, either show or hide options.

				var drpDwnMenuCntnr = Cmn.GetNxtSibling(Cmn.GetNxtSibling(targetElem));
				if (Cmn.HasCls(drpDwnMenuCntnr, "Hide")) {
					var partNbrLnksWithBox = Cmn.GetElementsByClsNm("AddToOrdBxCreated", "a"),
						partNbr = targetElem.id.replace("InLnOrdWebPart_AttrDropDwn&Color&", ""),
						parentRow;
						
					for (var i=0; i<partNbrLnksWithBox.length; i++){
						if (partNbrLnksWithBox[i].innerHTML == partNbr){
							parentRow = Cmn.GetAncestorByTagNm(partNbrLnksWithBox[i], "tr");
							break;
						}
					}
					
					if (parentRow){
						Me.ResetBxObj(targetElem, parentRow);
					}

					Me.ResetBxObj(targetElem, mBxObj.ParentRow);
					var inLnOrdMainCntnr = Cmn.GetAncestorByClsNm(targetElem, "InLnOrdWebPart_RacingStripe")
						  , attrCntnrsPrsnt = Cmn.GetElementsByClsNm("InLnOrdWebPart_ChildAttrCntnr", "div", inLnOrdMainCntnr)
						  , listElements = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_AttrLstItm", "li", drpDwnMenuCntnr)
						  , viewportHeight = Cmn.GetViewportHeight()
						  , otherAttrChldCntnr = Cmn.GetAncestorByClsNm(targetElem, "InLnOrdWebPartLayout_AttrSlctWithOther")
						  , attrInpBxCntnr = Cmn.GetNxtSiblingBy(otherAttrChldCntnr, function (elem) { return Cmn.HasCls(elem, "InLnOrdWebPartLayout_AttrInpBxCntnr"); })
						  , partNbrInfoCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPart_PartNbrInfo", "div", inLnOrdMainCntnr)[0]
						  , transInfoCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPart_TransInfo", "div", inLnOrdMainCntnr)[0]
						  , targetElemY = Cmn.GetY(targetElem); ;

                    // Drop-down menu was hidden so show menu and hide all other menus.						
                    hideAttrMenu();

                    // Add a relative position and a z-index of one to both the parent table cell and
                    // the parent attribute child container. This is for IE7 compatibility. 
                    var parentTd = Cmn.GetAncestorByTagNm(targetElem, "td")
						  , parentAttrCntnr = Cmn.GetAncestorByClsNm(targetElem, "InLnOrdWebPartLayout_AttrChldCntnrPosRelative");

                    Cmn.AddCls(parentTd, "InLnOrdWebPartLayout_ActvAttrCell");
                    Cmn.AddCls(parentAttrCntnr, "InLnOrdWebPartLayout_AttrCntnrZIdx");

                    // Find the y position of the bottom of the drop down box.
                    var drpDownYPos = targetElemY + (listElements.length + 1) * Cmn.GetHeight(targetElem);

                    // If on a catalog page, the scroll postion needs to be subtracted from the drop down position
                    if (mCtlgShellCntnr) {
                        drpDownYPos -= window.scrollY;
                    }

                    // Show the menu
                    Cmn.RemCls(drpDwnMenuCntnr, "Hide");

                    // If the drop down menu won't fit on the screenspace above, make it drop downward
                    if (Cmn.GetHeight(drpDwnMenuCntnr) > screen.height - (screen.height - targetElemY)) {
                        if (Cmn.IsIE() || Cmn.IsSafari()) {
                            // Do nothing if the browser is IE.  
                        } else {
                            // For menus extending down remove position relative from the containing divs so the menu will
                            // appear in front of the elements below it rather than behind them. 
                            for (var loopIdx = 0; loopIdx < attrCntnrsPrsnt.length; loopIdx++) {
                                Cmn.ReplaceCls(attrCntnrsPrsnt[loopIdx], "InLnOrdWebPartLayout_AttrChldCntnrPosRelative", "InLnOrdWebPartLayout_AttrChldCntnrPosStatic");
                            }
                        }
                    }

                    // Check that the y position of the bottom of the drop down is less than the viewport height
                    else if (drpDownYPos < viewportHeight) {
                        if (Cmn.IsIE() || Cmn.IsSafari()) {
                            // Do nothing if the browser is IE.  
                        } else {
                            // For menus extending down remove position relative from the containing divs so the menu will
                            // appear in front of the elements below it rather than behind them. 
                            for (var loopIdx = 0; loopIdx < attrCntnrsPrsnt.length; loopIdx++) {
                                Cmn.ReplaceCls(attrCntnrsPrsnt[loopIdx], "InLnOrdWebPartLayout_AttrChldCntnrPosRelative", "InLnOrdWebPartLayout_AttrChldCntnrPosStatic");
                            }
                        }

                    } else {
                        //For menus extending upwards make sure the class has position relative so the bottom of the menu 
                        //sits on the top of the drop down box							
                        var bottomPosn = Cmn.GetHeight(targetElem);

                        if (Cmn.IsIE6()) {
                            // If the browser is IE6, we need to use the master attribute container to set the 
                            // position of the bottom of the drop down menu container. 
                            var masterAttrCntnr = Cmn.GetAncestorByClsNm(parentAttrCntnr, "InLnOrdWebPartAttrCntnr")
								  , masterAttrCntnrHeight = Cmn.GetHeight(masterAttrCntnr)
								  , cntnrInd = true
								  , specCntnr = Cmn.GetNxtSiblingBy(parentAttrCntnr, function (elem) { return Cmn.HasCls(elem, "InLnOrdWebPartLayout_SpecClass"); })
								  , partNbrInfoHeight = Cmn.GetHeight(partNbrInfoCntnr)
								  , transInfoCntnrHeight = Cmn.GetHeight(transInfoCntnr)
								  , alertCntnr = Cmn.GetFrstChldByClsNm(masterAttrCntnr, "InLnOrdWebPartLayout_Alert")
								  , ordHistCntnr = Cmn.GetFrstChldByClsNm(partNbrInfoCntnr, "InLnOrdWebPart_OrdHistCntnr")
								  , qtyErrCntnr = Cmn.GetFrstChldByClsNm(partNbrInfoCntnr, "InLnOrdWebPartLayout_QtyErr");

                            // Switch the position of the child attribute container from relative to static for IE6. 
                            for (var loopIdx = 0; loopIdx < attrCntnrsPrsnt.length; loopIdx++) {
                                Cmn.ReplaceCls(attrCntnrsPrsnt[loopIdx], "InLnOrdWebPartLayout_AttrChldCntnrPosRelative", "InLnOrdWebPartLayout_AttrChldCntnrPosStatic");

                                // Subtract the height of child attribute containers above the one selected.
                                if (attrCntnrsPrsnt[loopIdx] == parentAttrCntnr) {
                                    cntnrInd = false;
                                }

                                if (cntnrInd) {
                                    masterAttrCntnrHeight = masterAttrCntnrHeight - Cmn.GetHeight(attrCntnrsPrsnt[loopIdx]) - parseFloat(Cmn.GetStyle(parentAttrCntnr, "marginTop"));
                                } else {
                                    // Do nothing. 
                                }
                            }

                            if (otherAttrChldCntnr || specCntnr) {
                                // If the item has a "please specify" box or a spec container, do not add the extra border space.
                                bottomPosn = masterAttrCntnrHeight - bottomPosn + parseFloat(Cmn.GetStyle(parentAttrCntnr, "marginTop"));
                            } else {
                                // Otherwise, add the border to the bottom position. 
                                bottomPosn = masterAttrCntnrHeight - bottomPosn + parseFloat(Cmn.GetStyle(parentAttrCntnr, "marginTop")) + ATTR_DROP_DOWN_BORDER;
                            }

                            // If this is a presentation where the transaction content container extends below the part number
                            // information container, there is more slack at the bottom of the box that cannot be found in
                            // padding or margins. Take this difference and add it to the bottom position as well. 
                            if (transInfoCntnrHeight > partNbrInfoHeight) {
                                bottomPosn = bottomPosn + (transInfoCntnrHeight - partNbrInfoHeight) - ATTR_DROP_DOWN_BORDER;
                            }

                            // If a warning message is showing, we must take its height into account.
                            if (Cmn.HasCls(alertCntnr, "Show")) {
                                bottomPosn = bottomPosn - Cmn.GetHeight(alertCntnr) - CHLD_ATTR_TOP_BORDER;
                            }

                            // If the order history message is showing, we must take its height into account.
                            if (Cmn.HasCls(ordHistCntnr, "Hide")) {
                                // Do nothing.
                            } else {
                                bottomPosn = bottomPosn + Cmn.GetHeight(ordHistCntnr) - ATTR_DROP_DOWN_BORDER;
                            }

                            // If the quantity error message is showing, we must take its height into account.
                            if (Cmn.HasCls(qtyErrCntnr, "Show")) {
                                bottomPosn = bottomPosn + Cmn.GetHeight(qtyErrCntnr) - ATTR_DROP_DOWN_BORDER;
                            }

                        } else {
                            if (attrInpBxCntnr && Cmn.HasCls(attrInpBxCntnr, "Show")) {
                                // If there is a "please specify" box showing, adjust the calculation
                                // for the bottom of the attribute menu. 

                                bottomPosn = bottomPosn
											   + Cmn.GetHeight(attrInpBxCntnr) + parseFloat(Cmn.GetStyle(attrInpBxCntnr, "marginBottom"))
											   - ATTR_DROP_DOWN_BORDER;
                                // If this is an attribute menu with an "other" option, include its bottom margin in the 
                                // calculation. 
                                if (otherAttrChldCntnr) {
                                    bottomPosn = bottomPosn + parseFloat(Cmn.GetStyle(otherAttrChldCntnr, "marginBottom"));
                                }
                            } else {
                                bottomPosn = bottomPosn - ATTR_DROP_DOWN_BORDER

                                if (attrInpBxCntnr) {
                                    if (Cmn.IsIE()) {
                                        // For IE7 and IE8, add the bottom margin of the "please specify" container
                                        // to the calculation for the bottom position.
                                        bottomPosn = bottomPosn + parseFloat(Cmn.GetStyle(attrInpBxCntnr, "marginBottom"));
                                    } else {
                                        bottomPosn = bottomPosn - ATTR_DROP_DOWN_BORDER;
                                    }
                                }
                            }
                        }
                        Cmn.SetStyle(drpDwnMenuCntnr, 'bottom', bottomPosn + 'px');
                    }

                    Cmn.SetStyle(drpDwnMenuCntnr, 'border-top', '1px solid #999999');

                    // Increase the z-index of the containing box so the drop-down menu
                    // will overlay other inline boxes if need be.
                    var inLnBxRacingDiv = Cmn.GetAncestorByClsNm(targetElem, "InLnOrdWebPartLayout_Overlay");
                    Cmn.AddCls(inLnBxRacingDiv, "InLnOrdWebPartLayout_OverlayMore");

                    // Show the menu
                    Cmn.RemCls(drpDwnMenuCntnr, "Hide");
                    // Min-width isn't recognized in IE6 so we'll have to set the width of each
                    // drop down menu container that has a width smaller than that of the menu.
                    if (Cmn.IsIE6()) {
                        if (otherAttrChldCntnr && Cmn.GetWidth(drpDwnMenuCntnr) > 116) {
                            Cmn.SetStyle(drpDwnMenuCntnr, "width", "116px");
                        } else {
                            if (Cmn.GetWidth(drpDwnMenuCntnr) < 142) {
                                Cmn.SetStyle(drpDwnMenuCntnr, "width", "142px");
                            }
                        }
                    }

                } else {
                    // Hide all opened boxes
                    hideAttrMenu();
                }
            }
            else {
                // Click was outside of open menu so close all open menus.
                hideAttrMenu();
            }
        } else {
            // Do nothing. 
        }
    };

    var hideAttrMenu = function () {
        // Click was outside menu so hide the menu.	
        var mainCntnr
			  , dropDwnMenuCntnrs
			  , loopIdx
			  , inLnBxRacingDivs
			  , attrChldCntnrs
			  , actvTds
			  , zIdxCntnrs;

        if (mMainContentCntnr) {
            mainCntnr = mMainContentCntnr;
        } else {
            mainCntnr = mCtlgShellCntnr;
        }

        drpDwnMenuCntnrs = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrDropDwnMenu", "div", mainCntnr);
        inLnBxRacingDivs = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_Overlay", "div", mainCntnr);
        attrChldCntnrs = Cmn.GetElementsByClsNm("InLnOrdWebPart_ChildAttrCntnr", "div", mainCntnr);
        actvTds = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_ActvAttrCell", "td", mainCntnr);
        zIdxCntnrs = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_AttrCntnrZIdx", "div", mainCntnr);

        // Hide each dropdown menu container. 
        for (loopIdx = 0; loopIdx < drpDwnMenuCntnrs.length; loopIdx++) {
            Cmn.AddCls(drpDwnMenuCntnrs[loopIdx], "Hide");
            Cmn.SetStyle(drpDwnMenuCntnrs[loopIdx], "bottom", "");
        }

        // *HACK* to fix Chrome lingering attribute menu bug
        if (Cmn.IsChrome()) {
            window.scrollBy(0, 0);
        }

        // Reset the z-index of the containing box 			
        Cmn.RemCls(inLnBxRacingDivs, "InLnOrdWebPartLayout_OverlayMore");

        // Set the attribute child menu classes back to their unselected state. 
        Cmn.ReplaceCls(attrChldCntnrs, "InLnOrdWebPartLayout_AttrChldCntnrPosStatic", "InLnOrdWebPartLayout_AttrChldCntnrPosRelative");

        // Remove the relative positioning from all the table cells. 
        Cmn.RemCls(actvTds, "InLnOrdWebPartLayout_ActvAttrCell");

        // Remove the z-index from any attribute containers. 
        Cmn.RemCls(zIdxCntnrs, "InLnOrdWebPartLayout_AttrCntnrZIdx");

    };

    var remStVals = function () {
        /// <summary>
        /// Removes state values in session for part numbers which are unloaded. 
        /// </summary>
        /// <remarks>
        /// This function gets called every time this web part is unloaded. If there are 
        /// multiple boxes open on one page, the unload method will get called for each 
        /// one. Since we don't update the global variable for the last box opened (mBxObj),
        /// we can use it to ensure that we do not take anything other than the last box 
        /// opened out of the session array containing all 'activated' boxes. 
        /// </remarks>

        // Update the state array.
        var inLnBxs = getVal(valDefs.InLnOrdBxsCrtd.KyTxt()),
			tempBxObj = mBxObj;

        if (inLnBxs) {
            // The catalog frame causes the original array of box objects stored in session to 
            // get converted to an object. We must recast the collection of objects back into
            // a proper array.
            var bxIdx = 0
				  , tempArray = [];

            while (inLnBxs[bxIdx]) {
                tempArray.push(inLnBxs[bxIdx]);
                bxIdx++;
            }

            inLnBxs = tempArray;

            for (var bxIdx = 0; bxIdx < inLnBxs.length; bxIdx++) {
                if (inLnBxs[bxIdx].PrimaryPartNbrTxts == "" && inLnBxs[bxIdx].Id == mBxObj.Id) {
                    if (mBxObj.VisibilityInd == true) {
                        if (bxIdx > 0
							   && inLnBxs[bxIdx - 1].ClosedByForceInd == true
							   && inLnBxs[bxIdx - 1].VisibilityInd == false) {
                            // If the box that was active prior to the current active box was closed by
                            // force using the function that handles multiple parts in the same row, make
                            // sure it opens once the active box closes.
                            inLnBxs[bxIdx - 1].VisibilityInd = true;
                        }
                        // Take the active box off the end of the box array to be stored in session. 
                        inLnBxs.splice(bxIdx, 1);
                        break;
                    } else {
                        // If the last user interaction in the array of active boxes 
                        // was one that closed a box, make sure it's marked to open upon
                        // a back button click. 
                        inLnBxs[bxIdx].VisibilityInd = true;
                        tempBxObj.VisibilityInd = false;
                        setVal(valDefs.ActvInLnOrdBx.KyTxt(), tempBxObj);
                    }
                } else {
                    // Check to see if this is a part number that appears multiple times.
                    if (inLnBxs[bxIdx].PrimaryPartNbrTxts.length > 0) {
                        // If it is, make sure we splice the correct entry.
                        if (inLnBxs[bxIdx].Id == mBxObj.Id) {
                            var actvBxPrimaries = mBxObj.PrimaryPartNbrTxts.split("|");
                            for (var primIdx = 0; primIdx < actvBxPrimaries.length; primIdx++) {
                                if (inLnBxs[bxIdx].PrimaryPartNbrTxts.indexOf(actvBxPrimaries[primIdx]) > -1) {
                                    // This is the right box.
                                    if (inLnBxs[bxIdx].VisibilityInd == true) {
                                        // Take the active box off the end of the box array to be stored in session. 
                                        inLnBxs.splice(bxIdx, 1);
                                        break;
                                    } else {
                                        // If the last user interaction in the array of active boxes 
                                        // was one that closed a box, make sure it's marked to open upon
                                        // a back button click. 
                                        inLnBxs[bxIdx].VisibilityInd = true;
                                        tempBxObj.VisibilityInd = false;
                                        setVal(valDefs.ActvInLnOrdBx.KyTxt(), tempBxObj);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            setVal(valDefs.InLnOrdBxsCrtd.KyTxt(), inLnBxs);
        }
    }

    var makeSesnLoadQSTxt = function (inLnBxsCrtd) {
        /// <summary>
        /// Makes the qs text to use for calling the server to load boxes
        /// on spec change or back button.
        /// </summary>
        /// <param name="inLnBxsCrtd">
        /// The hash table of the part numbers with boxes and their javascript objects.
        /// </param>

        var mcmTop = McMasterCom.Nav.GetTopFrame()
			  , visiblePartsArr = []
			  , partNbrIdx = 0
			  , specArr = []
			  , specArrIdx = 0;

        // Grab all part numbers that have the status of visible and assemble into 
        // a querystring text
        for (var i = 0; i < mCrtedBxObjs.length; i++) {
            if (mCrtedBxObjs[i].VisibilityInd == true) {
                visiblePartsArr[partNbrIdx] = mCrtedBxObjs[i];
                partNbrIdx++;
            } else {
                // Continue.
            }
        }
    }

    var updtAttr = function (e) {
        /// <summary>
        /// Calls the server to get the data to update box with attributed information
        /// </summary>
        /// <param name="e">
        /// The drop-down menu adjusted
        /// </param>
        var parentRow = Cmn.GetPrevSibling(Cmn.GetPrevSibling(Cmn.GetAncestorByTagNm(e, "tr")));
        // Find the part number link associated with the button that the user just clicked.
        // We have to check for this in case the user had more than one box open and chose
        // to add an item from an "inactive" box. 
        Me.ResetBxObj(e, parentRow);

		var mainCntnr = Cmn.GetAncestorByClsNm(e, "InLnOrdWebPartLayout_Main")
		  , attrnms = []
		  , attrvals = []
		  , attrCntnr = Cmn.GetAncestorByClsNm(e, "InLnOrdWebPartAttrCntnr")
		  , attrCntnrs = Cmn.GetChldrnBy(function (elem) { return Cmn.HasCls(elem, "InLnOrdWebPart_ChildAttrCntnr") }, attrCntnr)
		  , inpBx = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_AttrInpBx", "input", attrCntnr)[0]
		  , attrSlctCntnr = Cmn.GetAncestorByClsNm(e, "InLnOrdWebPart_ChildAttrCntnr")
		  , attrSlcts = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrDropDwn", "div", attrSlctCntnr)
		  , attrCntnrMetaDat = attrCntnr.attributes
		  , partNbrSeq = 0;
		  
		// Collect the attribute names and values.
		for (var cntnrIdx = 0; cntnrIdx < attrCntnrs.length; cntnrIdx++) {
			var attrSlct = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrDropDwn", "div", attrCntnrs[cntnrIdx])[0]
				  , attrLst = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrForm", "ul", attrCntnrs[cntnrIdx])[0];

			//get sequence number from the attribute container. 
			//this sequence number is used to uniquely identify each instance of same part number 
			for (var i=0; i<attrCntnrMetaDat.length; i++){
				if (attrCntnrMetaDat[i].name == "data-mcm-partnbr-seqnbr"){
					partNbrSeq = attrCntnrMetaDat[i].value;
					break;
				}
			}
			
			if (attrSlct) {
				var id = attrSlct.id;
				if (partNbrSeq && partNbrSeq > 0){
					id = id + partNbrSeq;
				}
				
				if (mAttrbtSlctdTbl.Itm(id)) {
					attrnms[cntnrIdx] = attrSlct.id.split('&')[IDSTRARR_ATTRNAME_INDEX];
					attrvals[cntnrIdx] = getAttrVal(mAttrbtSlctdTbl.Itm(id));
					var attrSlctsInnerHTML = attrSlct.innerHTML;
					if (attrvals[cntnrIdx] == "Other") {
						attrvals[cntnrIdx] = inpBx.value;
					} 
				}
			} else if (attrLst) {
				attrnms[cntnrIdx] = attrLst.id;
				var slctAttrRdoBtn = Cmn.GetElementsByClsNm("InLnOrdWebPart_AttrLstSlctd", "li", attrLst)[0];
				if (slctAttrRdoBtn) {
					attrvals[cntnrIdx] = getAttrVal(slctAttrRdoBtn.innerHTML);
				}
			}
		}
		
		var otherInpBxs = Cmn.GetElementsByClsNm("OtherValInpBx", "div");

        if (attrnms && attrvals) {
            attrNmsQSTxt = attrnms.join(String.fromCharCode(2029));
            attrValsQSTxt = attrvals.join(String.fromCharCode(2029));
        }

		var cnxnObj = {
			success: hndlUpdtAttrAjaxResp,
			failure: hndlFailedUpdtAttrAjaxResp,
			cnxnParm: {
				respTyp: McMaster.CnxnMgr.WEB_PART_RESP_TYP_TXT,
				PartNbrTxt: mainCntnr.id.replace("InLnOrdWebPartLayout_Main",""),
				inLnBxMainCntnr: mainCntnr
			}
		};

        var url = INLN_ORD_HTTP_HANDLER_URL + "?" +
						ACT_TXT + "=" +
						UPDT_ATTR_QS_KY_TXT + "&" +
						PART_NBR_QS_KY_TXT + "=" +
						mBxObj.PartNbrTxt + "&" +
						ATTR_NM_QS_KY_TXT + "=" +
						encodeURIComponent(attrNmsQSTxt) + "&" +
						ATTR_VAL_QS_KY_TXT + "=" +
						encodeURIComponent(attrValsQSTxt);

        // Use Connection Manager to call the web part's HTTP handler.
        McMaster.CnxnMgr.PerformAjaxCnxn(url, cnxnObj);

        Cmn.TrkAct("InLnOrdAttrChg&partnbr=" + mBxObj.PartNbrTxt, "InLnOrd");
		
		// TrkSrch
        var srchTrkInfo = new SrchTrkr.SrchDat({ usr: SrchTrkr.UsrActTyps.SLCT });
        srchTrkInfo.usr.srcNm = "InLnOrdWebPart";
        srchTrkInfo.usr.elemTyp = SrchTrkr.ElemTyps.INLINE_SPEC;
        srchTrkInfo.usr.slctdNm = decodeURIComponent(mBxObj.PartNbrTxt);
        srchTrkInfo.usr.spec = { attr: attrNmsQSTxt, val: attrValsQSTxt };
        srchTrkInfo.Trk();
    }

    var AttrChng = function (e) {
        /// <summary>
        /// Update the new attribute from the drop-down menu
        /// </summary>
        /// <param name="e">
        /// The drop-down menu item selected 
        /// </param>	
        var parentRow = Cmn.GetPrevSibling(Cmn.GetPrevSibling(Cmn.GetAncestorByTagNm(e, "tr")));
        Me.ResetBxObj(e, parentRow);

        var attrCntnr = Cmn.GetAncestorByClsNm(e, "InLnOrdWebPartAttrCntnr")
			  , attrSlctCntnr = Cmn.GetAncestorByClsNm(e, "InLnOrdWebPart_ChildAttrCntnr")
			  , attrAlertCntnrs = Cmn.GetElementsBy(function (elem) { return Cmn.HasCls(elem, "InLnOrdWebPart_AttrAlert"); }, 'div', attrCntnr)
			  , inLnOrdBxCntnr = Cmn.GetAncestorByClsNm(attrCntnr, "InLnOrdWebPart_RacingStripe")
			  , inpCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_AttrInpBxCntnr", "div", attrSlctCntnr)
			  , infoLeft = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_PartNbrInfoLeftNarrow", "div", inLnOrdBxCntnr)[0]
			  , infoLeftWidth = Cmn.GetWidth(infoLeft);

        for (var alertCntnrIDx = 0; alertCntnrIDx < attrAlertCntnrs.length; alertCntnrIDx++) {
            Cmn.ReplaceCls(attrAlertCntnrs[alertCntnrIDx], "Show", "Hide");
        }

        if (infoLeftWidth < 220) {
            Cmn.AddCls(inpCntnr, "InLnOrdWebPartLayout_AttrInpBxCntnrNarrow");

        } else {
            // Do nothing
        }

        if (e.id == "*") {
            // If Other is selected (id = *)				
            var stkmsgcntnr = Cmn.Get("InLnOrdWebPart_StkMsg" + mBxObj.PartNbrTxt);

            // Show the input box for the user inputed value.
            Cmn.ReplaceCls(inpCntnr, "Hide", "Show");

            //If the customer has selected an expanded view preference and have selected "Other"
            //after selecting another attribute value we need to remove the price for the previous item.
            var expdViewPrceTxtCntnr = Cmn.GetElementsByClsNm("InLnOrdWebPartLayoutExpdView_PrceCell", "div")[0];
            if (expdViewPrceTxtCntnr) {
                //If the container exists we need to clear out the price
                expdViewPrceTxtCntnr.innerHTML = "";
            } else {
                //Do nothing becasue you are in the regular view of inline ordering
            }

            // Take away the stock status. 
            stkmsgcntnr.innerHTML = "";

        } else {
            // Hide the attribute value input box.
            Cmn.ReplaceCls(inpCntnr, "Show", "Hide");
            // Call server to update with attributed part number data
            updtAttr(e);
        }
    };

    // TODO: Remove t2dxc
    var findBufferRow = function () {
        var rtnBufferRow
			  , partNbrLst = new Array()
			  , otherPartNbrLnk
			  , tempBufferRow
			  , arrayIdx = 0;

        for (var i = 0; i < mBxObj.TblCells.length; i++) {
            if (Cmn.HasCls(mBxObj.TblCells[i], "ItmTblCellPartNbr")) {
                otherPartNbrLnk = Cmn.GetFrstChld(mBxObj.TblCells[i]);

                if (otherPartNbrLnk) {
                    if (otherPartNbrLnk.innerHTML == mBxObj.PartNbrTxt) {
                        // Do nothing. 
                    } else {
                        partNbrLst[arrayIdx] = otherPartNbrLnk.innerHTML;
                    }
                }
            } else {
                // Do nothing.
            }
        }

        for (var j = 0; j < partNbrLst.length; j++) {
            tempBufferRow = Cmn.GetPrevSiblingBy(mBxObj.ParentRow, function (elem) { return Cmn.HasCls(elem, "InLnOrdWebPart_BufferRowFor" + partNbrLst[j]); });

            if (tempBufferRow) {
                rtnBufferRow = tempBufferRow;
                break;
            } else {
                // Continue. 
            }
        }

        return rtnBufferRow;
    };

    var scrollInLnBxToCntr = function (partNbrLnkPosn, horzScrollBarCatalog) {
        /// <summary>
        ///When the "catalog page" link is clicked on the inline ordering box, a part number search is executed, or a "part number" link 
        ///is clicked on the Order Pad, a catalog page will load. The inline ordering box will appear open and in the middle of 
        ///the screen.  
        /// </summary>

        //The height of the scrollable region, the scrollable region minus bottom navigation toolset, and midway point of scrollable region
        var ctlgPageViewportHgt;

        if (typeof (window.innerHeight) == "undefined") {
            // IE. 
            ctlgPageViewportHgt = window.document.documentElement.clientHeight - BOTTOMNAVTOOLSET_HGT;
        } else {
            // All other browsers. 
            ctlgPageViewportHgt = window.innerHeight - BOTTOMNAVTOOLSET_HGT;
        }

        var midwayPtOfCtlgPageViewportHgt = (ctlgPageViewportHgt / 2);

        //The position of the scroll top will be located at the difference between the part number link and 
        //the midway distance of the viewport height
        var scrollTopPosn = partNbrLnkPosn - midwayPtOfCtlgPageViewportHgt;

        //the scrollable container is the catalog page container to support pinned content
        window.document.getElementById("CtlgPageShell_CtlgPage_Cntnr").scrollTop += scrollTopPosn;
    };

    var getAttrVal = function (attrVal) {
        /// <summary>
        /// Parses out any special characters added by the browser.
        /// </summary>
        /// <param name="attrElem">
        /// An attribute element to interrogate.
        /// </param>
        /// <returns>
        /// The name of the attribute as it was originally sent from the server. 
        /// </returns>
        var rtnAttrVal = attrVal;

        if (attrVal.indexOf("&amp;") > -1) {
            attrVal = attrVal.replace("&amp;", "&");
            rtnAttrVal = attrVal;
        }

        return rtnAttrVal;
    };

    var getTxtWdth = function (rulerElem, dsplyTxt) {
        rulerElem.innerHTML = dsplyTxt;
        var dsplyTxtWdth = rulerElem.offsetWidth;
        rulerElem.innerHTML = "";
        return dsplyTxtWdth;
    }

    var reAddHorzntlRule = function (inLnOrdCntntCell) {
        /// <summary>
        /// Adds the horizontal rule back to tables that have it. 
        /// </summary>
        /// <param name="inLnOrdCntntCell">
        /// The content cell inside the content row of the inline ordering box.
        /// </param>

        if (Cmn.HasCls(inLnOrdCntntCell, "InLnOrdWebPartLayout_HorizontalRule")) {
            for (var tblCellIdx = 0; tblCellIdx < mBxObj.TblCells.length; tblCellIdx++) {
                Cmn.AddCls(mBxObj.TblCells[tblCellIdx], "ItmTblAllRuleContentCell");
            }
        }

    }

    var reCastObjToArr = function (arrObj) {
        /// <summary>
        /// Sometimes session inexplicably clones arrays incorrectly when
        /// we're in iFrames. We need this function to recast the (now)
        /// object of created inline ordering box ojects back to an array.
        /// </summary>
        /// <param nm="arrObj">
        /// The object that was once an array.
        /// </param>			
        // Set the global variables associated with the javascript objects.
        if (typeof (arrObj) == "object") {
            // Session inexplicably clones arrays incorrectly when we're
            // in iFrames. Recast the (now) object back to an array.
            var bxIdx = 0
				  , tempArray = [];

            while (arrObj[bxIdx]) {
                tempArray.push(arrObj[bxIdx]);
                bxIdx++;
            }

            arrObj = tempArray;
        }

        return arrObj;
    };

    var chkAvailLensDsc = function (qtyTxt) {
        /// <summary>
        /// Checks if there is an available lengths violation on the order.
        /// </summary>
        /// <param nm="qtyTxt">
        /// The quantity text the user entered.
        /// </param>
        /// <returns>
        /// A boolean value of true if there is an available lengths error.
        /// </returns>
        var rtnLenViolationInd = false;

        if (mMetaDat.AttrMstrAvailLensDsc.length == 0) {
            rtnLenViolationInd = true;
        } else {
            for (var lenIdx = 0; lenIdx < mMetaDat.AttrMstrAvailLens.length; lenIdx++) {
                rtnLenViolationInd = true;
                if (qtyTxt == mMetaDat.AttrMstrAvailLens[lenIdx] || qtyTxt % mMetaDat.AttrMstrAvailLens[lenIdx] == 0) {
                    rtnLenViolationInd = false;
                    break;
                }
            }
        };

        // Check to see if the customer is trying to order more than fifteen dollars worth of
        // merchandise. If they are, then let them break the available length restriction.
        if (rtnLenViolationInd == true && (qtyTxt * mMetaDat.PrceTxt >= 15)) {
            rtnLenViolationInd = false;
        }

        return rtnLenViolationInd;
    };
    
	// <summary>Find and replace all.</summary>
	// <param name="find">The substring to search for.</param>
	// <param name="rplc">The replacement substring.</param>
	// <param name="str">The text to be searched through. 
	// Does not alter original str.</param>
	// <returns>String with all replacements made.</returns>
	var replaceAllSubstr = function(find,rplc,str){
		var rplcd = str.replace(find,rplc);
		while(rplcd != rplcd.replace(find,rplc)){
			rplcd = rplcd.replace(find,rplc);
		}
		return rplcd;
	}
	
	

	
	///#End Region "Private Methods"		


    //#Region "Inline Order Spec Methods"
    //-------------------------------------------------------------------------
    // <summary>
    // Published message 
    // </summary>
    //-------------------------------------------------------------------------
    Me.PubSpecMsg = function (inLnSpecId, inpElem) {
        var MSG_HDR = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.SPEC);
        var partNbrTxt = inLnSpecId.split('_')[0];
        var prsnttnId = inLnSpecId.split('_')[1];
		InLnOrdWebPart.updtSpecAttr(inLnSpecId, inpElem);
        return this;
    };

    //-------------------------------------------------------------------------
    // <summary>
    // Update Spec attribute
    // </summary>
    //-------------------------------------------------------------------------
    Me.updtSpecAttr = function (inLnSpecId, clickedElem) {
        
		var attrnms = []
		  , attrvals = []
		  , inLnSpecIdComps = inLnSpecId.split('_')
		  , partNbrTxt = inLnSpecIdComps[0]
		  , prsnttnId = inLnSpecIdComps[1]
		  , seqNbr;
		
		//sequence number only exists for duplicate part numbers 
		if (inLnSpecIdComps.length > 2){
			seqNbr = inLnSpecIdComps[2];
		}
		
		var mainCntnr;
		if (clickedElem) {
			mainCntnr = Cmn.GetAncestorByClsNm(clickedElem, "InLnOrdWebPartLayout_Main")
		} else {
			if (chkCtlgPageInd()) {
				var mainIFrame = document.getElementById("MainIFrame");
				var ctlgPageElem = getObjFrmIFrameById(mainIFrame, "Catalog");
				mainCntnr = getObjFrmIFrameById(ctlgPageElem, "InLnOrdWebPart_Main" + partNbrTxt);
			} else {
				mainCntnr = Cmn.Get("InLnOrdWebPart_Main" + partNbrTxt);
			}
		}
		
		var qtyInpBx = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_InpBx", "input", mainCntnr)[0];
		var partNbrLnk = fndPartNbrLnkByClsNm(partNbrTxt, "PartNbrLnk", seqNbr) || fndPartNbrLnkByClsNm(partNbrTxt, "AddToOrdBxCreated", seqNbr);
		
		//do not trust mBxObj
		//get correct box based on part number from mCrtedBxObjs dictionary
		for (var i = 0; i < mCrtedBxObjs.length; i++) {
			if (mCrtedBxObjs[i].PartNbrLnk == partNbrLnk) {
				//then we found the right mBxObj, use this
				mBxObj = mCrtedBxObjs[i];
				break;
			}
		}
		
		var otherInpBxs = Cmn.GetElementsByClsNm("OtherValInpBx", "input", mainCntnr);
		
		if (isInLnSpec(partNbrLnk)) {
            if (otherInpBxs) {
				for (var i = 0; i < otherInpBxs.length; i++) {
					attrvals[attrvals.length] = otherInpBxs[i].value;
					var divId = Cmn.GetAncestorByClsNm(otherInpBxs[i], "SpecSrch_Attribute").id;
					var attrIdArray = divId.split("_")
					attrnms[attrnms.length] = attrIdArray[PUB_ATTR_ID_IDX];
				}
			}
		}
		
        // Join the attribute names and values into a query string
        // delimited by the proper character.
		if (attrnms && attrvals) {
			attrNmsQSTxt = attrnms.join(String.fromCharCode(2029));
			attrValsQSTxt = attrvals.join(String.fromCharCode(2029));
		}

        var cnxnObj = {
            success: hndlUpdtAttrAjaxResp,
            failure: hndlFailedUpdtAttrAjaxResp,
            cnxnParm: {
                respTyp: McMaster.CnxnMgr.WEB_PART_RESP_TYP_TXT,
                PartNbrTxt: partNbrTxt,
                PrsnttnID: prsnttnId,
                inLnBxMainCntnr: mainCntnr,
				AttrNms: attrnms,
				AttrVals: attrvals, 
				ClickedElem: clickedElem
            }
        };

        var partNbrLnk = fndPartNbrLnkByClsNm(partNbrTxt, "PartNbrLnk") || fndPartNbrLnkByClsNm(partNbrTxt, "AddToOrdBxCreated");
		if (isInLnSpec(partNbrLnk)) {
			isInLnSpecInd = true;
		}
        var attrCompItmIds = partNbrLnk.getAttribute("data-mcm-attr-comp-itm-ids");
        var fullPrsnttnId = getFullPrsnttnId(partNbrLnk);

        var url = INLN_ORD_HTTP_HANDLER_URL + "?" +
				  ACT_TXT + "=" +
				  UPDT_ATTR_QS_KY_TXT + "&" +
				  PART_NBR_QS_KY_TXT + "=" +
				  partNbrTxt + "&" +
				  IS_INLNSPEC + "=" +
				  isInLnSpecInd + "&" +
				  ATTR_COMP_IDS + "=" +
				  attrCompItmIds + "&" +
				  FULL_PRSNTTN_ID_KY_TXT + "=" +
				  fullPrsnttnId + "&" +
				  PRSNTTN_ID_KY_TXT + "=" +
				  prsnttnId + "&" +
				  ATTR_NM_QS_KY_TXT + "=" +
				  encodeURIComponent(attrNmsQSTxt) + "&" +
				  ATTR_VAL_QS_KY_TXT + "=" +
				  encodeURIComponent(attrValsQSTxt);

        if (qtyInpBx && qtyInpBx.value > 0) {
            url = url + "&" + QTY_TXT_QS_KY_TXT + "=" + qtyInpBx.value;
        }
        var inLnSpecDict = McMaster.SesnMgr.GetStVal(valDefs.InLnSpecUsrInps.KyTxt());
        url = inLnSpecDict[inLnSpecId].AddSpecUsrInpQS(url);

        // Use Connection Manager to call the web part's HTTP handler.
        // Store connection in global, public variable so InLnOrdWebPartLoader.AbortStaleReq
		// can query for and abort outdated requests
		Me.PrevCntxtSrchCnxn = McMaster.CnxnMgr.PerformAjaxCnxn(url, cnxnObj);

         //Track attribute click in inline ordering
		if (clickedElem==undefined) 
		{
		Cmn.TrkAct("InLnOrdSpecAttrChg&partnbr=" + partNbrTxt, "InLnOrd");
		} 
		else {        
		Cmn.TrkAct("InLnOrdSpecAttrChg&partnbr=" + partNbrTxt + "&AttrSelected=" + clickedElem.innerHTML, "InLnOrd");
		}
	}

    //-------------------------------------------------------------------------
    // <summary>
    // hide inline spec box
    // </summary>	
    //-------------------------------------------------------------------------
    var hideInLnSpecBx = function (partNbrLnk) {
        var parentRow = Cmn.GetAncestorByTagNm(partNbrLnk, "tr");
        var specChoiceLnks = Cmn.GetElementsByClsNm("SpecChoiceSlctd", "a", parentRow);
        for (var specChoiceLnkIdx = 0; specChoiceLnkIdx < specChoiceLnks.length; specChoiceLnkIdx++) {
            Cmn.ReplaceCls(specChoiceLnks[specChoiceLnkIdx], "SpecChoiceSlctd", "SpecChoiceVisitedLnk ");
        }

        var prceLnks = Cmn.GetElementsByClsNm("PrceLnkSlctd", "a", parentRow);
        for (var prceLnksIdx = 0; prceLnksIdx < prceLnks.length; prceLnksIdx++) {
            Cmn.ReplaceCls(prceLnks[prceLnksIdx], "PrceLnkSlctd", "PrceLnkVisited ");
        }

        if (isInLnSpec(partNbrLnk)) {
			var prsnttnId = getPrsnttnId(partNbrLnk);
			var partNbrTxt = partNbrLnk.innerHTML;
			var seqNbr = partNbrLnk.getAttribute("data-mcm-partnbr-seqnbr");
			var inLnSpecId = partNbrTxt + "_" + prsnttnId;
			if (seqNbr){
				inLnSpecId = inLnSpecId + '_' + seqNbr;
			}
			var inLnSpecDict = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.InLnSpecUsrInps.KyTxt());
			inLnSpecDict[inLnSpecId].RemAll();
			McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.InLnSpecUsrInps.KyTxt(), inLnSpecDict);
			var stkmsgcntnr = Cmn.Get("InLnOrdWebPart_StkMsg" + partNbrTxt);
			if (stkmsgcntnr) {
				stkmsgcntnr.innerHTML = "";
			}
		}
    }

    //-------------------------------------------------------------------------
    // <summary>
    // update specinteractions for inline order spec
    // </summary>
    //-------------------------------------------------------------------------
    var updtInlnSpecInteractions = function (webPartObj) {
        SpecInteractions.AddAttrIdToNmDefs(webPartObj);

		//Remove event listeners
		SpecInteractions.RemoveEvntListeners(webPartObj);
		//Attach event listeners
		SpecInteractions.AttachEvntListeners(webPartObj, McMaster.MsgMgr.CntxtNms.INLN_ORD, InLnOrdWebPartLoader, true, mBxObj.MainCntnr);

		//Obtain session dictionary of SpecSrchInps
		var inLnSpecDict = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.InLnSpecUsrInps.KyTxt());
		var seqNbr = webPartObj.PartNbrLnk.getAttribute("data-mcm-partnbr-seqnbr");
		var inLnSpecId;
		
		if (webPartObj.PartNbrLnk.innerHTML == "") {
			inLnSpecId = webPartObj.MetaDat.PartNbrTxt + '_' + webPartObj.PrsnttnId;
		} else {
			inLnSpecId = webPartObj.PartNbrLnk.innerHTML + '_' + webPartObj.PrsnttnId;
		}
		
		//sequence number exists only for duplicate part number
		if (seqNbr){
			inLnSpecId = inLnSpecId + '_' + seqNbr;
		}

        //sync with server side decisions
        if (webPartObj.UsrInp) {
            inLnSpecDict[inLnSpecId].SyncWithServerUsrInp(webPartObj.UsrInp);
        }

        // If necessary, invalidate the explicitly expanded attribute in the SpecUsrInp state.
        if (webPartObj.InvalidatedLastExplicitlyExpandedAttrInd === true) {
            inLnSpecDict[inLnSpecId].RemExplicitlyExpandedAttr();
        }

        inLnSpecDict[inLnSpecId].RemAllProdFilters();
        McMaster.SesnMgr.SetStVal(valDefs.InLnSpecUsrInps.KyTxt(), inLnSpecDict);
    }

    //-------------------------------------------------------------------------
    // <summary>
    // Place the focus on either the contextual search box or the quantity box
    // </summary>
    //-------------------------------------------------------------------------
    var setCursorPos = function (bxObj) {
        var bxCntntRow = bxObj.BxCntntRow,
			specSrchInpBxs = Cmn.GetElementsByClsNm("SpecSrch_CntxtSrchBx", "input", bxCntntRow),
			inlnOrdInBxs = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_InpBx", "input", bxCntntRow);

        //Place the focus on either the contextual search box or the quantity box
		//or the title input box if there are any
        if (specSrchInpBxs.length > 0) {
            var inpBx = specSrchInpBxs[0];
            if (inpBx.setSelectionRange) {
                inpBx.focus();
                inpBx.setSelectionRange(inpBx.value.length, inpBx.value.length);
            } else if (inpBx.createTextRange) {
                // IE
                var range = inpBx.createTextRange();
                range.collapse(true);
                range.moveEnd('character', inpBx.value.length);
                range.moveStart('character', inpBx.value.length);
                range.select();
            }
        } else if (Cmn.GetElementsByClsNm("OtherValInpBx", "input", bxCntntRow)[0]){
			//Determine if there are any other input boxes already loaded (title input boxes)
			//If so, probably want to put the focus on the first empty one
			var inpBx = Cmn.GetElementsByClsNm("OtherValInpBx", "input", bxCntntRow);
			for (var j = 0; j < inpBx.length; j++) {
				if (inpBx[j].value.length == 0) {
					inpBx[j].focus();
					break;
				}
			}		
		} else if (Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_ItmSpecTxtBx","textarea",bxCntntRow)[0]){
			//Determine if there are any spec boxes
			//If so, probably want to put the focus on the first empty one
			Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_ItmSpecTxtBx","textarea",bxCntntRow)[0].focus();
		} else if (Cmn.GetElementsByClsNm("SizedInpBx","textarea",bxCntntRow)[0]){
			//Determine if there are any sized input boxes
			//If so, probably want to put the focus on the first empty one
			Cmn.GetElementsByClsNm("SizedInpBx","textarea",bxCntntRow)[0].focus();
		}else if (inlnOrdInBxs.length > 0) {
            inlnOrdInBxs[0].focus();
        }
    }

	//-------------------------------------------------------------------------	
	// <summary>
	// Unload spec
	// </summary>
	//-------------------------------------------------------------------------
	var unloadSpec = function () {
		var inLnSpecId = mBxObj.mWebPartObj.MetaDat.PartNbrTxt + '_' + mBxObj.mWebPartObj.PrsnttnId;
		var seqNbr = mBxObj.mWebPartObj.PartNbrLnk.getAttribute("data-mcm-partnbr-seqnbr");
		if (seqNbr){
			inLnSpecId = inLnSpecId + '_' + seqNbr;
		}
		var inLnSpecDict = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.InLnSpecUsrInps.KyTxt());
		if (inLnSpecDict) {
			var elem = inLnSpecDict[inLnSpecId];
			if (elem) {
				elem.RemAll();
			}
			McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.InLnSpecUsrInps.KyTxt(), inLnSpecDict);
		}
	};

	//-------------------------------------------------------------------------
	// <summary>
	// Get the part number link on which the user clicked based on the 
	// class name passed through. 
	// </summary>
	// <param name="partNbrTxt">The part number text.</param>
	// <param name="clsNm">The class name on the part number link we're seeking.</param>
	// <remarks> The class name indicates whether or not the box has been opened.</remarks>
	//-------------------------------------------------------------------------
	var fndPartNbrLnkByClsNm = function (partNbrTxt, clsNm, seqNbr) {
		var slctdPartNbrIdx;
		var partNbrLnks = Cmn.GetElementsByClsNm(clsNm, "a");

        //find part number links in catalog page
        if (partNbrLnks.length == 0) {
            if (chkCtlgPageInd()) {
                var mainIFrame = document.getElementById("MainIFrame");
                var ctlgPageElem = getObjFrmIFrameById(mainIFrame, "Catalog");
                if (ctlgPageElem) {
                    partNbrLnks = getObjFrmIFrameByClsNm(ctlgPageElem, clsNm);
                }
            }
        }

        // Look through part number links and find the one with the 
        // passed in class name and part number text as innerHTML 
        // that is in a table.  We want to ignore 
        // links not in a table, since we can not open our box for them.
        for (var lnkIdx = 0; lnkIdx < partNbrLnks.length; lnkIdx++) {
            if (partNbrLnks[lnkIdx].innerHTML == partNbrTxt &&
				partNbrLnks[lnkIdx].parentNode.tagName == "TD") {
				
				if (seqNbr){
					if (seqNbr == partNbrLnks[lnkIdx].getAttribute("data-mcm-partnbr-seqnbr")){
						slctdPartNbrIdx = lnkIdx;
					}
				}else{
					slctdPartNbrIdx = lnkIdx;
				}
				
				break;
			}
		}
		return partNbrLnks[slctdPartNbrIdx];
	}

    //-------------------------------------------------------------------------
    // <summary>
    // Check catalog page or dynamic page
    // </summary>
    //-------------------------------------------------------------------------
    var chkCtlgPageInd = function () {
        var ctlgPageInd = false;
        var prodPageObj = Cmn.GetObj("ProdPageContent");
        if (prodPageObj) {
            //we are in dynamic page
        } else {
            ctlgPageInd = true;
        }
        return ctlgPageInd;
    }

    //-------------------------------------------------------------------------
    // Summary: Gets an object from the DOM
    // Remarks: Distinguishes between product page and dynamic catalog pages
    // Input: IDTxt - the ID of the element to find
    //-------------------------------------------------------------------------
    var getObjFrmIFrameById = function (iframe, elemID) {
        var rtnObj = null;

        if (iframe) {
            if (iframe.contentDocument) {
                rtnObj = iframe.contentDocument.getElementById(elemID);
            } else if (iframe.contentWindow) {
                // For IE6 and IE7.
                rtnObj = iframe.contentWindow.document.getElementById(elemID);
            }
        }
        return rtnObj;
    }

    //-------------------------------------------------------------------------
    // Summary: Gets an object from the DOM
    // Remarks: Distinguishes between product page and dynamic catalog pages
    // Input: tageNm - tag name
    //-------------------------------------------------------------------------
    var getObjFrmIFrameTagNm = function (iframe, tagNm) {
        var rtnObjs = null;

        if (iframe) {
            if (iframe.contentDocument) {
                rtnObjs = iframe.contentDocument.getElementsByTagName(tagNm);
            } else if (iframe.contentWindow) {
                // For IE6 and IE7.
                rtnObjs = iframe.contentWindow.document.getElementsByTagName(tagNm);
            }
        }
        return rtnObjs;
    }

    //-------------------------------------------------------------------------
    // Summary: Gets an object from the DOM
    // Remarks: Distinguishes between product page and dynamic catalog pages
    // Input: ClsNm - class name
    //-------------------------------------------------------------------------
    var getObjFrmIFrameByClsNm = function (iframe, clsNm) {
        var rtnObjs = null;

        if (iframe) {
            if (iframe.contentDocument) {
                if (iframe.contentDocument.getElementsByClassName) {
                    rtnObjs = iframe.contentDocument.getElementsByClassName(clsNm);
                } else if (iframe.contentDocument.querySelectorAll) {
                    //IE8 does not support find element by class names 
                    rtnObjs = iframe.contentDocument.querySelectorAll('.' + clsNm);
                }

            } else if (iframe.contentWindow) {
                // For IE6 and IE7.
                rtnObjs = iframe.contentWindow.Cmn.GetElementsByClsNm(clsNm);
            }
        }
        return rtnObjs;
    }

    //-------------------------------------------------------------------------
    // <summary>
    // Get presentation id given the part number link
    // </summary>
    // <param name="partNbrTxt">The part number text.</param>
    //-------------------------------------------------------------------------
    var getFullPrsnttnId = function (partNbrLnk) {
        // Search the DOM for the part number link selected if the selection 
        // was done from a full presentation
        var elem = partNbrLnk.parentNode;
        while (elem.className.indexOf("FullPrsnttn") == -1) {
            elem = elem.parentNode;
        }
        return elem.id.split("_")[1];
    };

    //---------------------------------------------------------------------
    // Summary: Gets the presentation id for the part number link (sub or full)
    //---------------------------------------------------------------------
    var getPrsnttnId = function (partNbrLnk) {
        var elem = partNbrLnk.parentNode;
        var prsnttnIdFoundInd = false;
        while (prsnttnIdFoundInd == false) {
            var clsNms = elem.className.split(" ");
            for (var i = 0; i < clsNms.length; i++) {
                //this image belongs to general info or spec info
                //we do not want to trigger image filtering
                if (clsNms[i].search(/PrsnttnStructure/i) >= 0) {
                    prsnttnIdFoundInd = true;
                    break;
                };
            };

            if (prsnttnIdFoundInd == false) {
                elem = elem.parentNode;
            }
        }

        if (elem) {
            //remove "FULL_" or "SUB_" prefix
            prsnttnId = elem.id.split("_")[1]; ;
        }

        return prsnttnId;
    };

    //-------------------------------------------------------------------------
    // <summary>
    // Checks if this is inline spec 
    // </summary>
    //-------------------------------------------------------------------------
    var isInLnSpec = function (partNbrLnk) {
        var rtnVal = false;
        try {
			if (partNbrLnk) {
				var attrCompIdsTxt = partNbrLnk.getAttribute("data-mcm-attr-comp-itm-ids");
				if (attrCompIdsTxt) {
					rtnVal = true;
				}
			}
		} catch (ex) {
			//do nothing
		}	
		return rtnVal;
    }

    //-------------------------------------------------------------------------
    // <summary>
    // Remove inline order box for newly converted presentations 
    // </summary>
    //-------------------------------------------------------------------------
    var remInLnOrdBx = function (bxHdrRow, bxCntnrRow, partNbrTxt, partNbrLnk) {
        // Grab the state values
        var inLnBxsCrtd = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.InLnOrdBxsCrtd.KyTxt());
        // Remove the part number from the state variable if there.
        var inLnBxs = reCastObjToArr(inLnBxsCrtd);
        for (var i = 0; i < inLnBxs.length; i++) {
            if (inLnBxs[i].PartNbrTxt == partNbrTxt) {
                inLnBxs.splice(i, 1);
                break;
            }
        }

        // Set the global variables associated with the javascript objects.
        var crtedBxs = reCastObjToArr(mCrtedBxObjs);
        // Session inexplicably clones arrays incorrectly when we're
        // in iFrames. Recast the (now) object back to an array.
        for (var i = 0; i < crtedBxs.length; i++) {
            if (crtedBxs[i].PartNbrTxt == partNbrTxt) {
                crtedBxs.splice(i, 1);
            }
        }
        mCrtedBxObjs = crtedBxs;

        //update the session state value
        McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.InLnOrdBxsCrtd.KyTxt(), inLnBxs);

        //remove html elements
        Cmn.RemElem(bxHdrRow);
        Cmn.RemElem(bxCntnrRow);

        //remove css classes
        var classNms = partNbrLnk.className.split(" ");
        for (var i = 0; i < classNms.length; i++) {
            switch (classNms[i]) {
                case "PartNbrLnk":
                case "PartNbrSlctd":
                case "PartNbrVisitedLnk":
                    //keep them
                    break;
                default:
                    Cmn.RemCls(partNbrLnk, classNms[i]);
                    break;
            }
        }

        if (partNbrLnk.parentNode != undefined && partNbrLnk.parentNode.tagName == "TD") {
            Cmn.RemCls(partNbrLnk.parentNode, "AddToOrdBxHidden");
        }
    }
    //#End Region
}
}

this.InLnOrdWebPartDynamicRendering||(InLnOrdWebPartDynamicRendering=new function(){var f=0,q=0,X,G=!0,Y,a;this.WebPart_Load=function(e){a=e;"FULLPRSNTTN"==a.PartNbrSlctdMsgCntxtNm?Q("PartNbrSlctd"):Q("PartNbrLnk");McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.ActvInLnOrdBx.KyTxt(),a)};var Q=function(e){McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.ActvInLnOrdBx.KyTxt(),a);if(a.PartNbrLnk){var d;for(e=0;e<a.TblCells.length;e++)if(!Cmn.HasCls(a.TblCells[e],"ItmTblImgCell")&&!Cmn.HasCls(a.TblCells[e],
"ItmTblPivotImgCell")){d=a.TblCells[e];break}q=f=0;Y=InLnOrdWebPart.HndlRowsWithMultPartNbrs(a.ParentRow);Cmn.HasCls(a.PartNbrLnk,"AddToOrdBxCreated")||(Cmn.AddCls(a.PartNbrLnk,"AddToOrdBxCreated"),Cmn.AddCls(a.PartNbrLnk,"AddToOrdBxCreated"+a.Id),ga(d),Y||InLnOrdWebPart.CrteBufferRow(a.ParentRow));d=Cmn.GetTSOfActInclMS();Cmn.TrkAct("InLnOrdFiniBldBxFunc&partnbr="+a.PartNbrTxt+"&tm="+d,"InLnOrd")}},ga=function(e){var d=Cmn.GetTSOfActInclMS();Cmn.TrkAct("InLnOrdCrteInLnBxMarkUp&partnbr="+a.PartNbrTxt+
"&tm="+d,"InLnOrd");var r=a.TblCells.length,c=Cmn.CrteElement("tr"),t=Cmn.CrteElement("tr"),n,C=0,s,D=ha(),U=a.TblCells[D],P=ia(U,e),u,m,h;s=Cmn.GetWidth(a.ParentRow);Cmn.ReplaceCls(a.PartNbrCell,"ItmTblColSpacePartNbr","InLnOrdWebPartLayout_ItmTblPartNbrCell");u=Cmn.GetWidth(a.PartNbrCell);h=a.PartNbrCell.offsetLeft-e.offsetLeft;X=ba();var H=Cmn.CrteElement("td"),R=Cmn.CrteElement("td"),V=Cmn.CrteElement("div"),w=Cmn.CrteElement("td"),p=Cmn.CrteElement("div"),v=Cmn.CrteElement("div"),y=Cmn.CrteElement("td",
{id:a.CntnrIDTxt}),x;Cmn.IsIE10()&&(x=Cmn.CrteElement("div"));var l;l=a.PartNbrMetaDat.SellStdPkgQty&&"Packs"==a.PartNbrMetaDat.UMTxt?116:91;for(d=["AddToOrdFlow_ItmBx","AddToOrdFlow_ItmBxFor"+a.Id];!(Cmn.HasCls(a.TblCells[C],"ItmTblCellPartNbr")&&a.TblCells[C].firstChild==a.PartNbrLnk);)C++;for(var E=0;E<d.length;E++)Cmn.AddCls(c,d[E]),Cmn.AddCls(t,d[E]);a.PartNbrLnk.title="Close";var z=function(){var b;switch(Cmn.GetApplEnvrPrfx()+Cmn.GetApplEnvrSfx()){case "pubdev":case "pubqual":case "pub":b=
'<span class="MsdsSpan"><a class="SecondaryLnk InLnOrdWebPartLayout_LnkPadding" href="#" onclick="InLnOrdWebPart.ProdDetailLnk_Click(this,\''+a.PartNbrTxt+"'); return false;\">Product Detail</a>";break;default:b='<span class="MsdsSpan"></span>'}return b},A=function(){return'<form id ="frmMVstrBm" target = "OrderPadTarget" action ="/nav/MntnVstrBm.asp" name = "frmMVstrBm" class="InLnOrdWebPart_BmForm"<input type="hidden" value="ItmBxBm" name ="Context"><input type="hidden" value="'+McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.SesnExtRepKy.KyTxt())+
'" name ="sesnExtRep"><input type="hidden" value= "'+a.PartNbrTxt+'" name = "PartNbr"><input type="hidden" value = "Find" name ="tab"><input type="hidden" value = "False" name = "FastTrack"><input type="hidden" value = "'+a.PartNbrMetaDat.IntrnPartNbrTxt+'" name = "BmKyTxt"><input type="hidden" value = "1" name = "BmTypId"><input type="hidden" value = "add" name = "ActTyp"><input type="hidden" value = "0" name = "BmListIdAftr"><input type="hidden" value = "Bookmarks" name = "BmListNmAftr"><input type="hidden" value = "" name = "BmNmAftr"><input type="hidden" value = "Y" name = "BmNmSysIndAftr"></form>'},
I=function(){var b,g="InLnOrdWebPartLayout_StkMsg";b='<div id="InLnOrdWebPart_QtyInp'+a.PartNbrTxt+'" class="InLnOrdWebPartLayout_QtyInp"><input id="qtyInp'+a.PartNbrTxt+'" type="text"onkeyup="InLnOrdWebPart.InpBxKeyUp(event,this,\''+a.PartNbrTxt+'\');" class="InLnOrdWebPartLayout_InpBx">'+a.PartNbrMetaDat.UMTxt;"Packs"==a.PartNbrMetaDat.UMTxt&&a.PartNbrMetaDat.SellStdPkgQty&&(b=b+" of "+a.PartNbrMetaDat.SellStdPkgQty,"LB"==a.PartNbrMetaDat.SellStdPkgUMTxt&&(b=1<a.PartNbrMetaDat.SellStdPkgQty?b+" "+
a.PartNbrMetaDat.SellStdPkgPluralUMDscTxt.toLowerCase():b+" "+a.PartNbrMetaDat.SellStdPkgSingularUMDscTxt.toLowerCase()));91<l&&(g="InLnOrdWebPartLayout_StkMsgPacks");b=b+'</div><div class="InLnOrdWebPartLayout_AddtoOrd"><a class="InLnOrdWebPartLayout_AddToOrdIconGreyImg" href="#" onMouseOver="InLnOrdWebPart.MouseOverAddToOrdBtn(this)" onMouseOut="InLnOrdWebPart.MouseOutAddToOrdBtn(this)" onclick="InLnOrdWebPart.AddToOrd_Click(this); return false" title=""></a></div><div id="InLnOrdWebPart_StkMsg'+
a.PartNbrTxt+'" class="'+g+'">'+a.PartNbrMetaDat.StkMsg+"</div>";G||(b=b+'<div id = "InLnOrdWebPart_PrceTxt'+a.PartNbrTxt+'" class="InLnOrdWebPartLayout_PrceTxt">'+a.PartNbrMetaDat.PrceTxt+"</div>");return b},J=function(){var b="";if(a.PartNbrMetaDat.AvailLensDsc||0<a.PartNbrMetaDat.AttrMstrAvailLensDsc.length)b='<div class="Clear"></div><div id="InLnOrdWebPart_ItmNotes" class="InLnOrdWebPartLayout_ItmNotes Hide InLnOrdWebPartLayout_Bold">'+b+"Available lengths are ",b=a.PartNbrMetaDat.AvailLensDsc?
b+a.PartNbrMetaDat.AvailLensDsc:b+a.PartNbrMetaDat.AttrMstrAvailLensDsc,b+=". <br /></div>";return b},F=function(){var b="";a.PartNbrMetaDat.IsSpecInd&&!a.InlnOrdSpecInd&&(b='<div class="InLnOrdWebPartLayout_SpecClass">Specifications:<textarea id="InLnOrdWebPart_SpecBox" rows="3" cols="1" maxlength="150" class="InLnOrdWebPartLayout_ItmSpecTxtBx" onkeypress="return InLnOrdWebPart.SpecBxKeyPress(event, this);"></textarea></div>');return b},K=function(){var b="";if(a.PartNbrMetaDat.IsAttrMstrInd||void 0!=
a.mWebPartObj.MarkupTxt){var g,k,e=!1,c=new CmnColls.HashTable(a.PartNbrMetaDat.Attrs),d=c.Keys(),c=c.Vals(),h,b=(b=a.PartNbrLnk.getAttribute("data-mcm-partnbr-seqnbr"))?'<div class="Clear"></div><div id="InLnOrdWebPartAttrCntnr'+a.PartNbrTxt+'" data-inlnspecid= '+a.PartNbrTxt+"_"+a.mWebPartObj.PrsnttnId+"_"+b+" data-mcm-partnbr-seqnbr="+b+' class="InLnOrdWebPartAttrCntnr InLnOrdWebPartLayout_AttrsCntnr">':'<div class="Clear"></div><div id="InLnOrdWebPartAttrCntnr'+a.PartNbrTxt+'" data-InLnSpecId= '+
a.PartNbrTxt+"_"+a.mWebPartObj.PrsnttnId+' class="InLnOrdWebPartAttrCntnr InLnOrdWebPartLayout_AttrsCntnr">';void 0==a.mWebPartObj.MarkupTxt&&(a.mWebPartObj.MarkupTxt="");if(a.PartNbrLnk.getAttribute("data-mcm-attr-comp-itm-ids"))b+=a.mWebPartObj.MarkupTxt;else{b+='<div class="InLnOrdWebPartLayout_Alert Hide InLnOrdWebPart_AttrAlert">Please complete the specification for this item.</div>';for(g=0;g<d.length;g++)if("Custom*"==d[g])a.PartNbrMetaDat.IsSpecInd=!0,b+=F(),a.PartNbrMetaDat.IsSpecInd=!1;
else{if(2<c[g].AttrVals.length){e=!1;for(k=0;k<c[g].AttrVals.length;k++)"*"==c[g].AttrVals[k].ValTxt&&(e=!0);b+='<div class = "InLnOrdWebPart_ChildAttrCntnr InLnOrdWebPartLayout_AttrChldCntnrPosRelative">';e?(b+='<div class="InLnOrdWebPartLayout_AttrSlctWithOther">',h="InLnOrdWebPartLayout_AttrDropDwnWithOther",k="InLnOrdWebPartLayout_AttrDropDwnMenuWithOther"):(h="InLnOrdWebPartLayout_AttrDropDwn",k="InLnOrdWebPartLayout_AttrDropDwnMenu");b=b+c[g].Nm+':<br><div id="InLnOrdWebPart_AttrDropDwn&'+c[g].Nm+
"&"+a.PartNbrTxt+'" class="'+h+' InLnOrdWebPart_AttrDropDwn">Select from list...</div><span id="rulerSpan&'+c[g].Nm+"&"+a.PartNbrTxt+'" class="InLnOrdWebPartLayout_RulerSpn"></span><div id="InLnOrdWebPart_AttrDropDwnMenu" class="'+k+' InLnOrdWebPart_AttrDropDwnMenu Hide" style="max-height:168px; overflow-y:auto; overflow-x:hidden;"><ul id="InLnOrdWebPart_AttrDropDwnMenuLst" class="InLnOrdWebPartLayout_AttrDropDwnMenuLst">';for(k=0;k<c[g].AttrVals.length;k++)b="*"==c[g].AttrVals[k].ValTxt?b+'<li class="InLnOrdWebPartLayout_AttrLstItm" id="'+
c[g].AttrVals[k].ValTxt+'" onmouseover="InLnOrdWebPart.MouseOver(this)" onmouseout="InLnOrdWebPart.MouseOut(this)">Other</li>':b+'<li class="InLnOrdWebPartLayout_AttrLstItm" id="'+c[g].AttrVals[k].ValTxt+'" onmouseover="InLnOrdWebPart.MouseOver(this)" onmouseout="InLnOrdWebPart.MouseOut(this)">'+c[g].AttrVals[k].ValTxt+"</li>";b+="</ul></div>";e&&(b+='</div><div class="InLnOrdWebPartLayout_AttrInpBxCntnr Hide"> Please specify: <br /><input class="InLnOrdWebPartLayout_AttrInpBx" maxlength="250"/></div>')}else{b+=
'<div class = "InLnOrdWebPart_ChildAttrCntnr InLnOrdWebPartLayout_AttrChldCntnrPosRelative">';b=b+c[g].Nm+':<br><ul id="'+c[g].Nm+'" class="InLnOrdWebPart_AttrForm">';for(k=0;k<c[g].AttrVals.length;k++)b=b+'<li id = "'+c[g].AttrVals[k].ValTxt+'" class = "InLnOrdWebPart_AttrLst" align = "Top" onclick="InLnOrdWebPart.AttrLstChng(this,\''+a.PartNbrTxt+"')\">"+c[g].AttrVals[k].ValTxt+"</li>";b+="</ul>"}b+='<div class="InLnOrdWebPartLayout_Clear Clear"></div></div>'}}b+="</div>"}return b},Q=function(){var b=
s-f-q-e.offsetLeft,g=-1,c=U.offsetLeft-h+Cmn.GetWidth(U)-parseFloat(Cmn.GetStyle(U,"padding-right"))-l;m=b-1-1-9-3;var b=h-25-3-9-1-f,d=m-(b+25+l);0>d&&(b-=Math.abs(d));0>c&&(g=5>25-Math.abs(c)?0:25-Math.abs(c));n=(c=a.PartNbrLnk.getAttribute("data-mcm-partnbr-seqnbr"))?'<div id="InLnOrdWebPart_RacingStripe'+a.PartNbrTxt+'" class="InLnOrdWebPartLayout_Overlay InLnOrdWebPart_RacingStripe" style="width:'+m+'px"><div class="InLnOrdWebPartLayout_CloseIcon"><a data-mcm-partnbr-seqnbr= '+c+' class="InLnOrdWebPart_CloseLnk InLnOrdWebPartLayout_CloseIconGreyImg" onclick="InLnOrdWebPart.CloseBx(this); return false;" href="#" onMouseOver="InLnOrdWebPart.MouseOverCloseBtn(this)" onMouseOut="InLnOrdWebPart.MouseOutCloseBtn(this)" title="Close"></a></div><div id="InLnOrdWebPart_Lnks'+
a.PartNbrTxt+'"data-mcm-partnbr-seqnbr= '+c+' class="InLnOrdWebPart_Hdr InLnOrdWebPartLayout_Lnks">'+z()+"</div>"+A()+'<div class="Clear InLnOrdWebPartLayout_Clear"></div><div id="InLnOrdWebPart_Main'+a.PartNbrTxt+'" class = "InLnOrdWebPartLayout_Main"><div style="width: '+b+"px":'<div id="InLnOrdWebPart_RacingStripe'+a.PartNbrTxt+'" class="InLnOrdWebPartLayout_Overlay InLnOrdWebPart_RacingStripe" style="width:'+m+'px"><div class="InLnOrdWebPartLayout_CloseIcon"><a class="InLnOrdWebPart_CloseLnk InLnOrdWebPartLayout_CloseIconGreyImg" onclick="InLnOrdWebPart.CloseBx(this); return false;" href="#" onMouseOver="InLnOrdWebPart.MouseOverCloseBtn(this)" onMouseOut="InLnOrdWebPart.MouseOutCloseBtn(this)" title="Close"></a></div><div id="InLnOrdWebPart_Lnks'+
a.PartNbrTxt+'" class="InLnOrdWebPart_Hdr InLnOrdWebPartLayout_Lnks">'+z()+"</div>"+A()+'<div class="Clear InLnOrdWebPartLayout_Clear"></div><div id="InLnOrdWebPart_Main'+a.PartNbrTxt+'" class = "InLnOrdWebPartLayout_Main"><div style="width: '+b+"px";-1<g&&(n=n+"; padding-right: "+g+'px"');return n=n+'" class="InLnOrdWebPartLayout_PartNbrInfoLeftNarrow InLnOrdWebPart_PartNbrInfo"><div class="InLnOrdWebPart_ItmDsc InLnOrdWebPartLayout_ItmDsc">'+a.PartNbrMetaDat.Dsc+"</div>"+J()+F()+K()+'<div id="InLnOrdWebPartQtyErr'+
a.PartNbrTxt+'" class = "InLnOrdWebPartLayout_Alert InLnOrdWebPartLayout_QtyErr Hide"></div><div class="InLnOrdWebPartOrdHistMsg'+a.PartNbrTxt+' InLnOrdWebPart_OrdHistCntnr Hide" ></div></div><div style="width: '+l+'px;" class="InLnOrdWebPartLayout_TransCntRight InLnOrdWebPart_TransInfo">'+I()+'</div><div class="Clear InLnOrdWebPartLayout_Clear"></div></div></div>'},ca=function(){var b,c;W(a.PartNbrLnk)?(b=Cmn.GetWidth(a.ParentTbl)-f+Math.abs(q)-5-e.offsetLeft-l-20-9-3-1-1,m=1+b+20+l+1,c="InLnOrdWebPartLayout_PartNbrInfoLeftSmallBx"):
(b=150>h?150+u-9-3-1-1:h+u-9-3-1-1,m=1+b+25+l+5,c="InLnOrdWebPartLayout_PartNbrInfoLeftNarrow");var k=a.PartNbrLnk.getAttribute("data-mcm-partnbr-seqnbr");return n=k?'<div id="InLnOrdWebPart_RacingStripe'+a.PartNbrTxt+'" class="InLnOrdWebPartLayout_Overlay InLnOrdWebPart_RacingStripe InLnOrdWebPart_FlippedRendering"style="width:'+m+'px"><div class="InLnOrdWebPart_CloseIcon"><a data-mcm-partnbr-seqnbr= '+k+' class="InLnOrdWebPart_CloseLnk InLnOrdWebPartLayout_CloseIconGreyImg" onclick="InLnOrdWebPart.CloseBx(this); return false;" href="#" onMouseOver="InLnOrdWebPart.MouseOverCloseBtn(this)" onMouseOut="InLnOrdWebPart.MouseOutCloseBtn(this)" title="Close"></a></div><div id="InLnOrdWebPart_Lnks'+
a.PartNbrTxt+'"data-mcm-partnbr-seqnbr= '+k+' class="InLnOrdWebPart_Hdr">'+z()+"</div>"+A()+'<div class="Clear InLnOrdWebPartLayout_Clear"></div><div id="InLnOrdWebPart_Main'+a.PartNbrTxt+'" class = "InLnOrdWebPartLayout_Main"><div class="'+c+' InLnOrdWebPart_PartNbrInfo" style="width: '+b+'px;"><div class="InLnOrdWebPart_ItmDsc InLnOrdWebPartLayout_ItmDsc">'+a.PartNbrMetaDat.Dsc+"</div>"+J()+K()+F()+'<div id="InLnOrdWebPartQtyErr'+a.PartNbrTxt+'" class = "InLnOrdWebPartLayout_Alert InLnOrdWebPartLayout_QtyErr Hide"></div><div class="InLnOrdWebPartOrdHistMsg'+
a.PartNbrTxt+' InLnOrdWebPart_OrdHistCntnr Hide InLnOrdWebPartLayout_OrdHistMsgNarrow"></div></div><div style="width: '+l+'px;" class="InLnOrdWebPartLayout_TransCntRight InLnOrdWebPart_TransInfo">'+I()+'</div><div class="Clear InLnOrdWebPartLayout_Clear"></div></div></div>':'<div id="InLnOrdWebPart_RacingStripe'+a.PartNbrTxt+'" class="InLnOrdWebPartLayout_Overlay InLnOrdWebPart_RacingStripe InLnOrdWebPart_FlippedRendering"style="width:'+m+'px"><div class="InLnOrdWebPart_CloseIcon"><a class="InLnOrdWebPart_CloseLnk InLnOrdWebPartLayout_CloseIconGreyImg" onclick="InLnOrdWebPart.CloseBx(this); return false;" href="#" onMouseOver="InLnOrdWebPart.MouseOverCloseBtn(this)" onMouseOut="InLnOrdWebPart.MouseOutCloseBtn(this)" title="Close"></a></div><div id="InLnOrdWebPart_Lnks'+
a.PartNbrTxt+'" class="InLnOrdWebPart_Hdr">'+z()+"</div>"+A()+'<div class="Clear InLnOrdWebPartLayout_Clear"></div><div id="InLnOrdWebPart_Main'+a.PartNbrTxt+'" class = "InLnOrdWebPartLayout_Main"><div class="'+c+' InLnOrdWebPart_PartNbrInfo" style="width: '+b+'px;"><div class="InLnOrdWebPart_ItmDsc InLnOrdWebPartLayout_ItmDsc">'+a.PartNbrMetaDat.Dsc+"</div>"+J()+K()+F()+'<div id="InLnOrdWebPartQtyErr'+a.PartNbrTxt+'" class = "InLnOrdWebPartLayout_Alert InLnOrdWebPartLayout_QtyErr Hide"></div><div class="InLnOrdWebPartOrdHistMsg'+
a.PartNbrTxt+' InLnOrdWebPart_OrdHistCntnr Hide InLnOrdWebPartLayout_OrdHistMsgNarrow"></div></div><div style="width: '+l+'px;" class="InLnOrdWebPartLayout_TransCntRight InLnOrdWebPart_TransInfo">'+I()+'</div><div class="Clear InLnOrdWebPartLayout_Clear"></div></div></div>'},Z=function(){var b=parseFloat(Cmn.GetStyle(a.TblCells[D],"padding-right"));W(a.TblCells[D])&&200>h?(b=Cmn.GetStyle(a.ParentTbl,"margin-right"),q="auto"==b?0:-parseFloat(b)):q=a.TblCells[D+1]?s-a.TblCells[D+1].offsetLeft+b:G?a.TblCells[D+
1]?s-a.TblCells[D+1].offsetLeft+b:0<s-a.PartNbrCell.offsetLeft-a.PartNbrCell.offsetWidth-100?s-a.PartNbrCell.offsetLeft-a.PartNbrCell.offsetWidth-100:0:Cmn.GetWidth(a.TblCells[C])-l-5},d=function(){for(var b=0;b<a.TblCells.length;b++)Cmn.RemCls(a.TblCells[b],"ItmTblAllRuleContentCell");b=Cmn.GetFrstChld(t);Cmn.AddCls(b,"InLnOrdWebPartLayout_HorizontalRule")},S=function(){if(0<a.TblCells.length)if(60<=h&&70>h){var b=a.PartNbrCell.offsetLeft-e.offsetLeft;f=b-10}else b=parseFloat(Cmn.GetStyle(a.TblCells[0],
"text-indent")),f=b+parseFloat(Cmn.GetStyle(a.TblCells[0],"padding-left"))},L=function(){Cmn.AddCls(c,"InLnOrdWebPartLayout_HdrRw");Cmn.GetPrevSibling(e)?R.colSpan=C-1:R.colSpan=Math.max(C,1);Cmn.AddCls(V,"InLnOrdWebPartLayout_LeftHdrDiv");Cmn.SetStyle(V,"margin-left",f+"px");Cmn.SetStyle(V,"margin-right","-1px");R.appendChild(V);Cmn.AddCls(R,"InLnOrdWebPartLayout_LeftHdrCell");c.appendChild(R)},M=function(){w.colSpan=Math.max(r-(C+1),1);Cmn.SetStyle(p,"border-bottom","solid 1px rgb(192,192,192)");
Cmn.SetStyle(p,"border-left","solid 1px rgb(192,192,192)");Cmn.SetStyle(p,"height","1px");Cmn.SetStyle(p,"margin-right",q+"px");Cmn.SetStyle(p,"margin-left","-1px");Cmn.SetStyle(p,"position","relative")},$=function(){itmDscWdth=h-1-9-3-25-f;bxWidth=s-f-q-e.offsetLeft;w.appendChild(p);c.appendChild(w);Cmn.InsrtAfter(c,a.ParentRow)},N=function(){var b=s-e.offsetLeft;Cmn.IsIE10()&&(0<f&&(b-=f),0<q&&(b-=q));if(Cmn.IsIE9()||Cmn.IsIE10())f-=1,b-=1;Cmn.SetStyle(y,"width",b+"px");y.colSpan=r;Cmn.AddCls(v,
"InLnOrdWebPartLayout_CntntDiv");Cmn.IsIE10()?Cmn.SetStyle(x,"margin","0px "+q+"px 0px "+f+"px"):Cmn.SetStyle(v,"margin","0px "+q+"px 0px "+f+"px");Cmn.SetStyle(v,"width",m+9+3+"px");Cmn.AddCls(t,"InLnOrdWebPart_CntntRowFor"+a.Id);v.innerHTML=n;Cmn.IsIE10()&&Cmn.SetStyle(x,"width",b+"px");a.PartNbrMetaDat.SubstPartNbrMsg&&(Cmn.GetFrstChld(v).innerHTML=a.PartNbrMetaDat.SubstPartNbrMsg)},O=function(a,c,e,d){e.appendChild(c);Cmn.IsIE10()?(d.appendChild(a),c.appendChild(d)):c.appendChild(a)},W=function(b){return Cmn.HasCls(a.ParentTbl,
"SideBySideTbl")?!0:!1},B=function(){var b=Cmn.GetAncestorByClsNm(a.ParentTbl,"SubPrsnttnCntnrTd")||Cmn.GetAncestorByClsNm(a.ParentTbl,"SubPrsnttnCell");return null===b?!1:Cmn.GetNxtSibling(b)||Cmn.GetPrevSibling(b)?!0:!1},da=function(){var b=Cmn.GetAncestorByClsNm(a.ParentTbl,"SubPrsnttnCntnrTd")||Cmn.GetAncestorByClsNm(a.ParentTbl,"SubPrsnttnCell"),c=Cmn.GetWidth(b),e=Cmn.GetAncestorByClsNm(a.ParentTbl,"floated"),d=0;if(e&&Cmn.GetAncestorByClsNm(b,"floated")!=e&&(b=Cmn.GetPrevSiblingBy(e,function(a){return Cmn.HasCls(a,
"floated")&&Cmn.HasCls(a,"ImgsCntnr")})))d=Cmn.GetWidth(b)+parseFloat(Cmn.GetStyle(b,"margin-right")),c-=d;return c},aa=function(){S();Z();n=Q();L();c.appendChild(H);M();$();N();O(v,y,t,x)},T=function(){S();q=s-f-350-e.offsetLeft;m=336;var b=h-1-9-f+3,g=m-b-l-25-5,d=b+l+25+g,p=-1,r=m-d;d>m&&(p=5>Math.abs(r)?0:25-Math.abs(r)-5);n=(d=a.PartNbrLnk.getAttribute("data-mcm-partnbr-seqnbr"))?'<div id="InLnOrdWebPart_RacingStripe'+a.PartNbrTxt+'" class="InLnOrdWebPartLayout_Overlay InLnOrdWebPart_RacingStripe" style="width:'+
m+'px"><div class="InLnOrdWebPartLayout_CloseIcon"><a data-mcm-partnbr-seqnbr= '+d+' class="InLnOrdWebPart_CloseLnk InLnOrdWebPartLayout_CloseIconGreyImg" onclick="InLnOrdWebPart.CloseBx(this); return false;" href="#" onMouseOver="InLnOrdWebPart.MouseOverCloseBtn(this)" onMouseOut="InLnOrdWebPart.MouseOutCloseBtn(this)" title="Close"></a></div><div id="InLnOrdWebPart_Lnks'+a.PartNbrTxt+'"data-mcm-partnbr-seqnbr= '+d+' class="InLnOrdWebPart_Hdr InLnOrdWebPartLayout_NarrowLnks">'+z()+'<span style="margin-right: 1px" class="VerticalSeprt"> </span></div>'+
A()+'<div class="Clear InLnOrdWebPartLayout_Clear"></div><div id="InLnOrdWebPart_Main'+a.PartNbrTxt+'" class = "InLnOrdWebPartLayout_Main"><div style="width: '+l+"px; padding-left:"+b+"px":'<div id="InLnOrdWebPart_RacingStripe'+a.PartNbrTxt+'" class="InLnOrdWebPartLayout_Overlay InLnOrdWebPart_RacingStripe" style="width:'+m+'px"><div class="InLnOrdWebPartLayout_CloseIcon"><a class="InLnOrdWebPart_CloseLnk InLnOrdWebPartLayout_CloseIconGreyImg" onclick="InLnOrdWebPart.CloseBx(this); return false;" href="#" onMouseOver="InLnOrdWebPart.MouseOverCloseBtn(this)" onMouseOut="InLnOrdWebPart.MouseOutCloseBtn(this)" title="Close"></a></div><div id="InLnOrdWebPart_Lnks'+
a.PartNbrTxt+'" class="InLnOrdWebPart_Hdr InLnOrdWebPartLayout_NarrowLnks">'+z()+'<span style="margin-right: 1px" class="VerticalSeprt"> </span></div>'+A()+'<div class="Clear InLnOrdWebPartLayout_Clear"></div><div id="InLnOrdWebPart_Main'+a.PartNbrTxt+'" class = "InLnOrdWebPartLayout_Main"><div style="width: '+l+"px; padding-left:"+b+"px";-1<p&&(n=n+"; padding-right: "+p+"px;");n=n+'" class="InLnOrdWebPartLayout_PartNbrInfoLeftNarrow InLnOrdWebPart_TransInfo">'+I()+'</div><div class="InLnOrdWebPartLayout_PartNbrInfoNarrow InLnOrdWebPart_PartNbrInfo" style="width: '+
g+'px;"><div class="InLnOrdWebPart_ItmDsc InLnOrdWebPartLayout_ItmDsc">'+a.PartNbrMetaDat.Dsc+"</div>"+J()+K()+F()+'<div id="InLnOrdWebPartQtyErr'+a.PartNbrTxt+'" class = "InLnOrdWebPartLayout_Alert InLnOrdWebPartLayout_QtyErr Hide"></div><div class="InLnOrdWebPartOrdHistMsg'+a.PartNbrTxt+' InLnOrdWebPart_OrdHistCntnr Hide InLnOrdWebPartLayout_OrdHistMsgNarrow"></div></div><div class="Clear InLnOrdWebPartLayout_Clear"></div></div></div>';L();c.appendChild(H);M();$();N();O(v,y,t,x)},E=function(){S();
q=P-f-400;n=ca();L();c.appendChild(H);M();itmDscWdth=150>h?150+u-1-9-3+1:h+u-1-9-3;bxWidth=13+itmDscWdth+25+l+5;var b=bxWidth+f-(h+u),e=Cmn.CrteElement("div");Cmn.SetStyle(e,"width","0px");Cmn.SetStyle(p,"width",b+"px");e.appendChild(p);w.appendChild(e);c.appendChild(w);Cmn.InsrtAfter(c,a.ParentRow);N();O(v,y,t,x)},ea=function(){S();Z();n=ca();L();c.appendChild(H);M();var b=Cmn.GetWidth(a.ParentTbl)-f+Math.abs(q)-5,d=Cmn.CrteElement("div"),k=X-ba();e&&(b-=e.offsetLeft);b=b-(h+u)+f+k+1+1;Cmn.SetStyle(d,
"width","0px");Cmn.SetStyle(p,"width",b+"px");d.appendChild(p);w.appendChild(d);c.appendChild(w);Cmn.InsrtAfter(c,a.ParentRow);N();O(v,y,t,x)},fa=function(b,e){var d=e-b;S();q=P-f-400;var r;r=150>h?e-1-1-l-5-3-9-20-d-15:h+u-9-3-1-1;m=+r+20+l+5;var s=a.PartNbrLnk.getAttribute("data-mcm-partnbr-seqnbr");n=s?'<div id="InLnOrdWebPart_RacingStripe'+a.PartNbrTxt+'" class="InLnOrdWebPartLayout_Overlay InLnOrdWebPart_RacingStripe InLnOrdWebPart_FlippedRendering"style="width:'+m+'px"><div class="InLnOrdWebPart_CloseIcon"><a data-mcm-partnbr-seqnbr= '+
s+' class="InLnOrdWebPart_CloseLnk InLnOrdWebPartLayout_CloseIconGreyImg" onclick="InLnOrdWebPart.CloseBx(this); return false;" href="#" onMouseOver="InLnOrdWebPart.MouseOverCloseBtn(this)" onMouseOut="InLnOrdWebPart.MouseOutCloseBtn(this)" title="Close"></a></div><div id="InLnOrdWebPart_Lnks'+a.PartNbrTxt+'"data-mcm-partnbr-seqnbr= '+s+' class="InLnOrdWebPart_Hdr">'+z()+"</div>"+A()+'<div class="Clear InLnOrdWebPartLayout_Clear"></div><div id="InLnOrdWebPart_Main'+a.PartNbrTxt+'" class = "InLnOrdWebPartLayout_Main"><div class="InLnOrdWebPartLayout_PartNbrInfoLeftSmallBx InLnOrdWebPart_PartNbrInfo"style="width: '+
r+'px;"><div class="InLnOrdWebPart_ItmDsc InLnOrdWebPartLayout_ItmDsc">'+a.PartNbrMetaDat.Dsc+"</div>"+J()+K()+F()+'<div id="InLnOrdWebPartQtyErr'+a.PartNbrTxt+'" class = "InLnOrdWebPartLayout_Alert InLnOrdWebPartLayout_QtyErr Hide"></div><div class="InLnOrdWebPartOrdHistMsg'+a.PartNbrTxt+' InLnOrdWebPart_OrdHistCntnr Hide InLnOrdWebPartLayout_OrdHistMsgNarrow"></div></div><div style="width: '+l+'px;" class="InLnOrdWebPartLayout_TransCntRightSmallBx InLnOrdWebPart_TransInfo">'+I()+'</div><div class="Clear InLnOrdWebPartLayout_Clear"></div></div></div>':
'<div id="InLnOrdWebPart_RacingStripe'+a.PartNbrTxt+'" class="InLnOrdWebPartLayout_Overlay InLnOrdWebPart_RacingStripe InLnOrdWebPart_FlippedRendering"style="width:'+m+'px"><div class="InLnOrdWebPart_CloseIcon"><a class="InLnOrdWebPart_CloseLnk InLnOrdWebPartLayout_CloseIconGreyImg" onclick="InLnOrdWebPart.CloseBx(this); return false;" href="#" onMouseOver="InLnOrdWebPart.MouseOverCloseBtn(this)" onMouseOut="InLnOrdWebPart.MouseOutCloseBtn(this)" title="Close"></a></div><div id="InLnOrdWebPart_Lnks'+
a.PartNbrTxt+'" class="InLnOrdWebPart_Hdr">'+z()+"</div>"+A()+'<div class="Clear InLnOrdWebPartLayout_Clear"></div><div id="InLnOrdWebPart_Main'+a.PartNbrTxt+'" class = "InLnOrdWebPartLayout_Main"><div class="InLnOrdWebPartLayout_PartNbrInfoLeftSmallBx InLnOrdWebPart_PartNbrInfo"style="width: '+r+'px;"><div class="InLnOrdWebPart_ItmDsc InLnOrdWebPartLayout_ItmDsc">'+a.PartNbrMetaDat.Dsc+"</div>"+J()+K()+F()+'<div id="InLnOrdWebPartQtyErr'+a.PartNbrTxt+'" class = "InLnOrdWebPartLayout_Alert InLnOrdWebPartLayout_QtyErr Hide"></div><div class="InLnOrdWebPartOrdHistMsg'+
a.PartNbrTxt+' InLnOrdWebPart_OrdHistCntnr Hide InLnOrdWebPartLayout_OrdHistMsgNarrow"></div></div><div style="width: '+l+'px;" class="InLnOrdWebPartLayout_TransCntRightSmallBx InLnOrdWebPart_TransInfo">'+I()+'</div><div class="Clear InLnOrdWebPartLayout_Clear"></div></div></div>';L();c.appendChild(H);M();itmDscWdth=150>h?e-1-1-l-5-3-9-20-d-15:h+u-9-3-1-1;bxWidth=13+itmDscWdth+25+l+1;d=bxWidth+f-(h+u);r=Cmn.CrteElement("div");Cmn.SetStyle(r,"width","0px");Cmn.SetStyle(p,"width",d+"px");r.appendChild(p);
w.appendChild(r);c.appendChild(w);Cmn.InsrtAfter(c,a.ParentRow);N();O(v,y,t,x)};a.PartNbrMetaDat.SubstPartNbrMsg?aa():75>h?W(a.PartNbrLnk)?ea():B()?(B=da(),348>B?fa(B,348):T()):T():75<=h&&200>h?W(a.PartNbrLnk)?ea():150>h?B()?(B=da(),T=20+l+150+u+X,T>B?fa(B,T):E()):E():aa():200<=h&&400>h?aa():(Z(),f=s-q-400,n=Q(),L(),c.appendChild(H),M(),$(),N(),O(v,y,t,x));Y||(Cmn.GetPrevSibling(e)?InLnOrdWebPart.ModifyRowSpanOnCntntCells(2):InLnOrdWebPart.ModifyRowSpanOnCntntCells(3));Cmn.InsrtAfter(c,a.ParentRow);
Cmn.HasCls(a.TblCells[0],"ItmTblAllRuleContentCell")&&d();Cmn.InsrtAfter(t,c);InLnOrdWebPart.ScrollToShowInLnOrdCntnr(a.PartNbrLnk,t);(d=Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_InpBx","input",t)[0])&&d.focus();d=Cmn.GetTSOfActInclMS();Cmn.TrkAct("InLnOrdFiniCrteInLnBxMarkUp&partnbr="+a.PartNbrTxt+"&tm="+d,"InLnOrd")},P=function(a){return Cmn.HasCls(a,"ItmTblCellPriceInterior")||Cmn.HasCls(a,"ItmTblCellPriceEnd")||Cmn.HasCls(a,"ItmTblCellPrce")||Cmn.HasCls(a,"ItmTblCellMultiPriceInteriorEnd")||
Cmn.HasCls(a,"ItmTblMultiPriceEnd")?!0:!1},ha=function(){for(var e,d,f,c=0;c<a.TblCells.length;c++)if((f=Cmn.GetElementBy(function(a){return Cmn.HasCls(a,"AddToOrdBxCreated")},"a",a.TblCells[c]))&&f.innerHTML==a.PartNbrTxt&&(d=c),f=Cmn.HasCls(a.TblCells[d+1],"ItmTblColSpaceUm")?!0:!1,f)if(P(a.TblCells[d+2])){if(G=!0,d){e=d+2;break}}else G=!1;else if(P(a.TblCells[d+1])){if(G=!0,d){e=d+1;break}}else G=!1;for(c=e;c<a.TblCells.length;c++)if(!P(a.TblCells[c]))return c-1;return a.TblCells.length-1},ia=
function(a,d){var f=Cmn.GetWidth(a);return a.offsetLeft+f-d.offsetLeft},ba=function(){var e=parseFloat(Cmn.GetStyle(a.PartNbrCell,"padding-left")),d=parseFloat(Cmn.GetStyle(a.PartNbrCell,"padding-right")),f=parseFloat(Cmn.GetStyle(a.PartNbrCell,"border-left")),c=parseFloat(Cmn.GetStyle(a.PartNbrCell,"border-right")),e=e+d;f&&(e+=f);c&&(e+=c);return e}});


var mstrDivNm = 'divBmNmExp';
var mstrFrmNm = 'frmMVstrBm';

function itmBookmarkGetFrm(strFrmNm){
	var objFrm;
	if (document.getElementById) objFrm = document.getElementById(strFrmNm); //use getElementById if supported
	else objFrm=document.forms[strFrmNm]; 
	return objFrm;
}


function itmBookmarkShowHideDiv()
{
	var objDiv=itmBookmarkGetFrm(mstrDivNm);
	if (objDiv.style.display == 'block'){
		objDiv.style.display = 'none';
	}
	else {
		objDiv.style.display = 'block';
		var objFrm = itmBookmarkGetFrm(mstrFrmNm);
		if (objFrm.BmNmSysIndAftr[0].checked == true){
			itmBookmarkSetBmNmFocus();
		}
	}
	return ;
}


function itmBookmarkSetBmNmFocus()
{
	var objFrm = itmBookmarkGetFrm(mstrFrmNm);
	objFrm.BmNmAftr.focus();
	objFrm.BmNmAftr.select();
}

function itmBookmarkBmNmOnFocus()
{
	var objFrm = itmBookmarkGetFrm(mstrFrmNm);
	objFrm.BmNmSysIndAftr[0].checked=true;
	objFrm.BmNmAftr.select();
}

function itmBookmarkBmNmLoseFocus()
{
	var objFrm = itmBookmarkGetFrm(mstrFrmNm);
	objFrm.BmNmAftr.value = objFrm.BmNmAftr.value; //Force the browser to deselect the text
}

function itmBookmarkSetWndwStat(strText)
{
	window.status = strText;
	return true;
}


function itmBookmarkTrimSpaces(strToTrim)
//Trims spaces from the left and right sides of a string
{
	var sRet;
	var nChar;
	var nStart = 0;
	var nEnd = 0;

	for(nChar = 0; nChar < strToTrim.length; nChar++)
	{
		nCharCode = strToTrim.charCodeAt(nChar);
		if(nCharCode != 32)
		{
			nStart = nChar;
			break;
		}           
	}

	for(nChar = strToTrim.length - 1; nChar >= 0; nChar--)
	{
		nCharCode = strToTrim.charCodeAt(nChar);
		if(nCharCode != 32)
		{
			 nEnd = nChar + 1;
			 break;
		}           
	}

	sRet = strToTrim.slice(nStart, nEnd);
	
	return sRet;
}

function itmBookmarkChkAndSubmit(strSrc) 
{
		//Do any screen edits that are required.
		// Make sure all required info is entered.
	var objFrm=itmBookmarkGetFrm(mstrFrmNm);

	objFrm.BmNmAftr.value = itmBookmarkTrimSpaces(objFrm.BmNmAftr.value);
	if ((objFrm.BmNmAftr.value == ''|| objFrm.BmNmAftr.value=='Your bookmark name') && objFrm.BmNmSysIndAftr[0].checked == true)
	{
		alert ('Please provide a name for your bookmark.');
		objFrm.BmNmAftr.focus();
		if (strSrc.toLowerCase() == 'onsubmit') return(false);
		else return;
	}
	itmBookmarkShowHideDiv();			
	if(objFrm.BmNmSysIndAftr[1].checked == true){
		objFrm.BmNmAftr.value = '';
	}

	//2004-05-10 Warning: when an interface is finally designed for multiple lists the logic that allows a visitor to create a new list
	//will have to set BmListIdAftr=0.  This is what tells the maintenance controller to create a new bookmark list.
	
	if (McMasterCom) {
		objFrm.target = 'ResultsIFrame'
	}
	
	objFrm.submit();
	if (strSrc.toLowerCase() == 'onsubmit') return(false);
	else return;
	
}


function itmBookmarkSubmitAddLink(){
	var objFrm=itmBookmarkGetFrm(mstrFrmNm);
	
	if (McMasterCom) {
		objFrm.target = 'ResultsIFrame'
	}

	objFrm.submit();
	return (false);
}


function itmBookmarkCncl(){
	var objFrm=itmBookmarkGetFrm(mstrFrmNm);
	
	itmBookmarkShowHideDiv();
	if (objFrm.BmNmSysIndBefr.value == 'N'){
		objFrm.BmNmSysIndAftr[0].checked= true;
		objFrm.BmNmAftr.value = objFrm.BmNmBefr.value;
	}
	else{
		objFrm.BmNmSysIndAftr[1].checked= true;
		objFrm.BmNmAftr.value = 'Your bookmark name';
	}
}


function itmBookmarkDel(){
	var objFrm=itmBookmarkGetFrm(mstrFrmNm);
	itmBookmarkShowHideDiv();
	
	if (McMasterCom) {
		objFrm.target = 'ResultsIFrame'
	}
	
	objFrm.ActTyp.value = 'delete';
	objFrm.submit();
	return (false);
}

function itmBookmarkSetCheckedBmNmSysIndRadio(intIndex){
	var objFrm = itmBookmarkGetFrm(mstrFrmNm);
	objFrm.BmNmSysIndAftr[intIndex].checked=true;
	return;
}





if (this.SpecInteractions){
} else {

SpecInteractions = new function () {

    // Global variable as to whether the cursor is currently a pointer (hand)
    var mCursorIsPointerInd = false;

    // A message header for messages published within the context of specifications
    var MSG_HDR = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.SPEC);

    // Provide a reference to this object
    var me = this;

    // An attribute id to attribute name lookup object
    var mAttrNmLookupObj = new CmnColls.HashTable();

    // The dropdown menu that's currently open
    var mOpenDropDownMenu = null;

    // Contextual search timeout object
    var mContextualSrchTimeout = null;
    var mLnSeqRegex = new RegExp(/^OrdPadProdsWebPart_LnSeq[0-9]+$/);
    var mNbrRegex = new RegExp(/\d+/);
    // time, in ms, to wait to respond to a [backspace] press in contextual search
    var CONTEXTUAL_SRCH_KEYSTROKE_BACKSPACE_TIMEOUT_MS_NBR = 250;

    // time, in ms, to wait to respond to a keystroke in contextual search
    var CONTEXTUAL_SRCH_KEYSTROKE_DEFLT_TIMEOUT_MS_NBR = 150;

    // Indicator of whether event listeners have been attached to the Spec Search pane in the Shell
    var mEvntsAttachedInd = false;

    var MAIN_CONTENT_CNTNR_NM = "MainContent";
    //ANALYTICS
    this.mTrkAct = null;
    this.mTrkAttr = null;
    this.mTrkVal = null;
    this.mTrkTrip = false;

    //class names
    var SPEC_SRCH_ATTR_CLS_NM = "SpecSrch_Attribute";
    var LANDING_PG_ATTR_CLS_NM = "LandingPage_ValPrsnttn"; 
    
    //Tracking actions
    var ACT = {
        CLICK_VLD: 'Selected spec',
        CLICK_SLCTD: 'Deselected spec',
        EXPAND_ATTRGRP: 'Expanded',
        CLEAR_ALL: 'Cleared all selected specs'
    };
	
	//Context Names
	var CNTXT = {
		LANDING_PAGE: 'LandingPage',
		CHOOSE_SPECS: 'ChooseSpecs',
		IN_LN_ORD: 'InLnOrd'
	};


    var VAL_SPEC_PAR_ELEM_ID_CD = {
        CAPTION: 'T',
        IMG: 'I'
    };
	
	//Sized input box constants
	var ZERO_WIDTH_SPACE = String.fromCharCode(parseInt(0x200B))
	  , UNICODE_CARRIAGE_RETURN = 13
	  , UNICODE_LINE_FEED = 10
	  , UNICODE_BACKSPACE = 8
	  , UNICODE_DELETE = 46
	  , UNICODE_CHARS_GRP1_STRT = 32
	  , UNICODE_CHARS_GRP1_END = 126
	  , UNICODE_CHARS_GRP2_STRT = 160
	  , UNICODE_CHARS_GRP2_END = 65535
	  , LEFT_ARROW_KEYCODE = 37
	  , RIGHT_ARROW_KEYCODE = 39;

    //Session State shortcuts
    var GetStVal = McMaster.SesnMgr.GetStVal;
    var StValDefs = McMaster.SesnMgr.StValDefs;

    //---------------------------------------------------------------------
    // Summary: Attaches event listeners
    // Input: webPartOjb - The web part object from the server that's 
    //           done loading.
    //        cntxtNm - The context in which the interaction occurred.
    //           This is used for web reports tracking.
    //        webPartLoader (optional) - The web part's loader. We use some 
    //           of its methods, such as for determining how to handle  
    //           requests that are already in flight. 
    //        maintainScrollPosnInd - Denotes whether we need to keep
    //           the selected value in the same position when the page
    //           gets re-loaded.
    //---------------------------------------------------------------------
    this.AttachEvntListeners = function (webPartObj, cntxtNm, webPartLoader, maintainScrollPosnInd, inLnCntnr) {

		if (inLnCntnr) {
			cntnr = inLnCntnr;
		} else {
			cntnr = Cmn.GetObj(webPartObj.CntnrIDTxt);
        }
		
        if (cntnr){
            //found
        }else{
            if (McMasterCom.Nav.GetTopFrame().MainIFrame){
                if (McMasterCom.Nav.GetTopFrame().MainIFrame.Catalog){
                    cntnr = McMasterCom.Nav.GetTopFrame().MainIFrame.Catalog.Cmn.GetObj(webPartObj.CntnrIDTxt);
                }
            }
        }

        Cmn.AddEvntListener(cntnr, "click", function (evnt) {
            me.HndlClickEvnt(evnt, cntxtNm, webPartLoader, maintainScrollPosnInd);
        });

        Cmn.AddEvntListener(cntnr, "keyup", function (evnt) {
            me.HndlCntxtSrch(evnt, cntxtNm, webPartLoader);
        });

        Cmn.AddEvntListener(cntnr, "mouseover", function (evnt) {
            hndlMouseOvrEvnt(evnt, cntxtNm, webPartLoader, cntnr);
        });

        Cmn.AddEvntListener(cntnr, "mouseout", function (evnt) {
            hndlMouseOutEvnt(evnt, cntxtNm, webPartLoader, cntnr);
        });

        Cmn.AddEvntListener(cntnr, "select", me.HndlSelectEvnt);
        Cmn.AddEvntListener(cntnr, "selectstart", me.HndlSelectEvnt);
		
		this.AttachDocEvntListeners();
    };
	
	this.AttachDocEvntListeners = function () {
        Cmn.AddEvntListener(document, "click", SpecSrchWebPart.SpecInfo.ClickHandler);
    };

    //---------------------------------------------------------------------
    // Summary: Removes event listenters
    // Input: The web part that's been unloaded.
    //---------------------------------------------------------------------
    this.RemoveEvntListeners = function (webPartObj) {

        var cntnr = Cmn.GetObj(webPartObj.CntnrIDTxt);
        if (cntnr){
            //found
        }else{
            if (McMasterCom.Nav.GetTopFrame().MainIFrame){
                if (McMasterCom.Nav.GetTopFrame().MainIFrame.Catalog){
                    cntnr = McMasterCom.Nav.GetTopFrame().MainIFrame.Catalog.Cmn.GetObj(webPartObj.CntnrIDTxt);
                }
            }
        }
        
        Cmn.RemEvntListeners(cntnr, "click");
        Cmn.RemEvntListeners(cntnr, "keyup");
        Cmn.RemEvntListeners(cntnr, "mouseover");
        Cmn.RemEvntListeners(cntnr, "mouseout");
        Cmn.RemEvntListeners(cntnr, "select");
        Cmn.RemEvntListeners(cntnr, "selectstart");
		
		this.RemoveDocEvntListeners();
	};
	
	this.RemoveDocEvntListeners = function () {
        Cmn.RemEvntListeners(document, "click");
    };

    //---------------------------------------------------------------------
    // Summary: Adds attribute id to attribute name definitions to the
    //          global dictionary.
    // Input: The web part that's been loaded.
    //---------------------------------------------------------------------
    this.AddAttrIdToNmDefs = function (webPartObj) {

        var attrIdToNmDefs = webPartObj.AttrIdToNmDict;
        var attrIds = Cmn.Utilities.Keys(attrIdToNmDefs);

        Cmn.forEach(attrIds, function (attrId) {
            mAttrNmLookupObj.Add(attrId, attrIdToNmDefs[attrId]);
        });
    };

    //------------------------------------------------------------
    // <summary>
    // Creates the tracking request for webreports.
    // </summary>
    //------------------------------------------------------------
    this.Webreports_TrkAct = function (cntxtNm, act, attr, val, trip, prodAttrId, prodValId, inpElem) {

        var loadFrmSesnInd = GetStVal(StValDefs.ChooseSpecsLoadFrmSesnInd.KyTxt());

        //Subsequent clicks on landing pages do not trigger a 204. It's because the 
        //loadFrmSesnInd is true. 
        if (cntxtNm.toUpperCase() == "LANDINGPAGE") {
            loadFrmSesnInd=false;
        }
        
        if (loadFrmSesnInd) {
            //don't track a session change
        } else if (trip) {
            //track with round trip duration so update
            //global tracking variables to hold it
            this.mTrkTrip = true;
            this.mTrkAct = act;
            this.mTrkAttr = (attr) ? attr : null;
            this.mTrkVal = (val) ? val : null;

        } else {
            //track the action performed.
            var actDscObj = {};
            actDscObj.Action = act;
            actDscObj.SrchTxt = GetStVal(StValDefs.SlctdSrchRsltTxt.KyTxt());
            if (attr) { actDscObj.Attribute = attr; }
            if (val) { actDscObj.Value = val; }
            Cmn.TrkAct(actDscObj, cntxtNm);

            // TrkSrch
            trkSrchValSlct(act, attr, val, cntxtNm, prodAttrId, prodValId, inpElem);
        }
    };


    //---------------------------------------------------------------
    // Summary: Creates the tracking request for custom tracking 
    //          messages.
    //
    // Input:   context name, tracking action and the message you
    //          want to track.
    //---------------------------------------------------------------
    this.Webreports_TrkCustomAct = function (cntxtNm, trkAct, trkMsg) {

        var srchTxt = GetStVal(StValDefs.SlctdSrchRsltTxt.KyTxt());
        var str = "Action=" + trkAct + "&SrchTxt=" + srchTxt;
        Cmn.TrkAct(str + trkMsg, cntxtNm);
    };
    
    //------------------------------------------------------------
    // Summary: creates a webreports tracking request for
    //          contextual search events.
    //------------------------------------------------------------
    this.Webreports_TrkContextualSrch = function (cntxtNm, attrId, cntxtSrchArgTxt, usrInpVal, prodAttrId) {

        var srchTxt = GetStVal(StValDefs.SlctdSrchRsltTxt.KyTxt());
        var msg = "Contextual search in " + srchTxt + " for " + me.GetAttrNm(attrId);

        if (cntxtSrchArgTxt.length > 0) {
            msg += ": " + cntxtSrchArgTxt;
        } else {
            msg += " was cleared out";
        }

        var actDscObj = {};
        actDscObj.action = msg;
        Cmn.TrkAct(actDscObj, cntxtNm);
        
        var srchTrkInfo = new SrchTrkr.SrchDat({ usr: SrchTrkr.UsrActTyps.KEY });
        srchTrkInfo.usr.elemTyp = SrchTrkr.ElemTyps.CNTXT_SRCH_BX;
        srchTrkInfo.usr.srcNm = getSrcNmFrmCntxt(cntxtNm);
        srchTrkInfo.usr.entryTxt = decodeURIComponent(usrInpVal);
        srchTrkInfo.usr.srchCntxt = decodeURIComponent(srchTxt);
        srchTrkInfo.usr.spec = { attr: me.GetAttrNm(attrId) };
		srchTrkInfo.usr.specIDs = { attrID: prodAttrId };
        srchTrkInfo.Trk();
    };

    //------------------------------------------------------------
    // <summary>
    // Creates the tracking request for webreports that will include
    // the duration of the web part's action in addition to the 
    // usual data
    // </summary>
    //------------------------------------------------------------
    this.Webreports_TrkTrip = function (cntxtNm) {

        if (this.mTrkTrip) {
            var srchTxt = GetStVal(StValDefs.SlctdSrchRsltTxt.KyTxt());
            var url = 'Action=' + encodeURIComponent(this.mTrkAct) + '&SrchTxt=' + encodeURIComponent(srchTxt);

            if (this.mTrkAttr) {
                url = url + '&Attribute=' + encodeURIComponent(this.mTrkAttr);
            }

            if (this.mTrkVal) {
                url = url + '&Value=' + encodeURIComponent(this.mTrkVal);
            }
            Cmn.TrkAct(url, cntxtNm);
        } else {
            //do nothing
        }

        //reset global tracking variables
        this.mTrkAct = null;
        this.mTrkAttr = null;
        this.mTrkVal = null;
        this.mTrkTrip = false;
    };

    //------------------------------------------------------------
    // <summary>
    // Retrieves the attribute name.
    // </summary>
    //------------------------------------------------------------
    this.GetAttrNm = function (attrId) {
        return mAttrNmLookupObj.table[attrId];
    };

    //------------------------------------------------------------
    // <summary>
    // Retrieves the attribute id from the given element.
    // </summary>
    //------------------------------------------------------------
    this.GetAttrId = function (inpElem) {
        return getPubAttrIdFrmTxt(inpElem.id);
    };

    //------------------------------------------------------------
    // Summary: Returns the attribute containing the given value
    //------------------------------------------------------------
    this.GetAttrByInnerElem = function (inpElem) {
        return getAttrByInnerElem(inpElem,SPEC_SRCH_ATTR_CLS_NM);
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element is in a dropdown menu
    //------------------------------------------------------------
    this.GetElemIsInDropDwnMenu = function (inpElem) {
        return getInpElemIsDropDwnVal(inpElem,SPEC_SRCH_ATTR_CLS_NM);
    };

    //------------------------------------------------------------
    // Summary: Returns the element that's visible for the given ID.
    // Input:   An element ID
    // Returns: The element with the given ID, or its complementary
    //          element -- whichever one is visible at the time.
    //------------------------------------------------------------          
    this.GetVisibleElemById = function (idTxt) {
        return getVisibleElemById(idTxt);
    };

    //------------------------------------------------------------
    // Summary: Returns the html element that complements the
    //          display state of the passed-in attribute container.
    // Input:   An element ID
    //------------------------------------------------------------          
    this.GetComplementaryElemById = function (idTxt) {
        return getComplementaryElemById(idTxt);
    };

	//------------------------------------------------------------
    // Summary: Returns the caption for the given image element
    //			or vice versa.
    //------------------------------------------------------------          
	this.GetComplementaryImgTxtElemById = function(inpElem) {
		 return getComplementaryImgTxtElemById(inpElem);
	};
	
    //------------------------------------------------------------
    // Summary: Handles the event "mousedown" and interprets
    //          the element id
    // Input:   The YUI event
    //          cntxtNm - context for the specification (spec search,
    //             landing page, etc). Largely used for web reports.
    //          webPartLoader (optional) - The loader for this web
    //               part. If it exists, call the method on the loader
    //               that determines whether a request is already in 
    //               flight. If so, ignore the current click event.
    //          maintainScrollPosnInd - Denotes whether we need to keep
    //               the selected value in the same position when the page
    //               gets re-loaded.
    //------------------------------------------------------------
    this.HndlClickEvnt = function (e, cntxtNm, webPartLoader, maintainScrollPosnInd) {

        if (webPartLoader && typeof webPartLoader.ReqInFlight === "function" && webPartLoader.ReqInFlight()) {
            // Don't respond to clicks when a request is in flight
        } else if (e) {
            // Check to see if the element OR one of its ancestors is clickable
            var targetElem = Cmn.GetEvntTarget(e);

            if (cntxtNm.toUpperCase() == "LANDINGPAGE") {

                if (targetElem && (targetElem.nodeName.toUpperCase() != "DIV" && targetElem.nodeName.toUpperCase() != "LI")) {

                    while (targetElem.parentNode) {
                        if (targetElem && (targetElem.nodeName.toUpperCase() != "DIV" && targetElem.nodeName.toUpperCase() != "LI")) {
                            targetElem = targetElem.parentNode;
                        } else {
                            break;
                        }
                    }
                }

            }

            var vldInpElem = getVldClickElem(targetElem) || Cmn.GetAncestorBy(targetElem, getVldClickElem);

            // If it's clickable then process the click event
            if (vldInpElem) {
                procssClckEvnt(vldInpElem, cntxtNm, maintainScrollPosnInd);

                if (SpecSrchWebPart.planningtimestamp) {
                    var now = new Date();
                    var delta = now - SpecSrchWebPart.planningtimestamp;
                    Cmn.TrkAct("FirstClick&delta=" + delta + "&type=specsrch");
                    SpecSrchWebPart.planningtimestamp = null
                }
            }

            // Check to see whether the selected element was a dropdown button
            if (vldInpElem && getInpElemIsDropDwnBtn(vldInpElem)) {
                // The dropdown button already took care of updating the dropdown menu
            } else {
                // Close any open dropdown menu
                SpecInteractions.ToggleDropDwnMenu(mOpenDropDownMenu);
            }
        }
    };

    //------------------------------------------------------------
    // Summary: Handles text selection (highlighting) events
    // Input:   The YUI event
    //------------------------------------------------------------
    this.HndlSelectEvnt = function (e) {

        if (e) {
            // Get the element being selected
            var targetElem = Cmn.GetEvntTarget(e);
            var vldInpElem = getVldClickElem(targetElem) || Cmn.GetAncestorBy(targetElem, getVldClickElem);

            // Prevent clickable elements from accidentally being selected.
            if (vldInpElem) {
                Cmn.PreventDeflt(e);
            }
        }
    };

    //------------------------------------------------------------
    // Summary: captures and processes the input for contextual
    //          search input
    // Input:   The keystroke event unique to each input element
    //------------------------------------------------------------
    this.HndlCntxtSrch = function (e, cntxtNm, webPartLoader) {

        if (e) {
            // You can type into contextual search boxes
            var targetElem = Cmn.GetEvntTarget(e);
            var vldInpElem = getVldCntxtSrchBx(targetElem) || Cmn.GetAncestorBy(targetElem, getVldCntxtSrchBx);

            // If it's a contextual search box, then perform the contextual search
            if (vldInpElem) {
                if (cntxtNm == "InLnOrd") {
                    procssInLnCntxtSrch(vldInpElem, e.keyCode, cntxtNm, webPartLoader);
                } else if (cntxtNm == "OrdPad") {
                    procssOrdPadLnCntxtSrch(vldInpElem, e.keyCode, cntxtNm, webPartLoader);
                } else if (cntxtNm == McMaster.MsgMgr.CntxtNms.ITM_PRSNTTN){
					procssItmPrsnttnCntxtSrch(vldInpElem, e.keyCode, cntxtNm, webPartLoader);
				}else {
                    procssCntxtSrch(vldInpElem, e.keyCode, cntxtNm, webPartLoader);
                }
            }
        }
    };

	// <summary>Wrapper for typing but not pasting.</summary>
	// <param name="box">HTML textarea to monitor.</param>
	// <param name="event">DOM Event</param>
	// <returns> void </returns>
	this.SizedInpTyping = function(box,event){
		var txt = box.value;
		var charPerLnLmt = box.getAttribute("data-mcm-cols");
		charPerLnLmt = parseInt(charPerLnLmt) ? parseInt(charPerLnLmt) : 0;
		var lnLmt = box.getAttribute("data-mcm-rows");
		lnLmt = parseInt(lnLmt) ? parseInt(lnLmt) : 0;
		var wrapInd = false;
		// get text that has been highlighted
		var sel = getSelection(box);
		
		// In keydown/keypress character hasn't been entered yet. Do so here.
		if (event.type === "keydown"){
			var key = event.keyCode;
			if (key == UNICODE_BACKSPACE || key == UNICODE_DELETE){
				txt = applyDeletion(key,sel,txt);
				wrapInd = true;
			}
		} else if (event.type === "keypress"){
			var key = getKey(event.keyCode, event.charCode, event.which);
			if (key == UNICODE_CARRIAGE_RETURN || 
				(UNICODE_CHARS_GRP1_STRT <= key && key <= UNICODE_CHARS_GRP1_END) ||
				(UNICODE_CHARS_GRP2_STRT <= key && key <= UNICODE_CHARS_GRP2_END)){
				txt = applyPrintableChar(key,sel,txt);
				wrapInd = true;
			}
		}
		
		if (wrapInd) {
			// Store the number of softbreaks before re-wrapping.
			var crsrOffset = countAllSubstr(ZERO_WIDTH_SPACE + "\n",txt,sel.start);
			// Wrap the text.
			txt = wrapAlgthm(txt,charPerLnLmt);
			// Update number of softbreaks in case cursor must move.
			crsrOffset = countAllSubstr(ZERO_WIDTH_SPACE + "\n", txt, sel.start) - crsrOffset;
			
			// Only use wrapped text if it is within line limit.
			if (verifyDimensions(txt,lnLmt)){
				box.value = txt;
				//update cursor position
				if (event.type === "keydown" && key == UNICODE_DELETE){
					setCursorPosn(box,sel.start);
				} else {
					setCursorPosn(box,sel.start+crsrOffset*2);
				}
			}
			Cmn.PreventDeflt(event);
		}
	}
	
	// <summary>Moves cursor to make soft wrapping invisible.</summary>
	// <param name="box">HTML textarea sized input box </param>
	// <returns> void </returns>
	this.SizedInpArrowKeys = function(box, event){
		var key = event.keyCode;
		var txt = box.value;
		var crsr = box.selectionEnd; // we only need the end=the moving part
		var dir = ""; //direction to shift the cursor
		
		// Helper function for moving cursor by one.
		var shiftCursorOnce = function(box,dir){
			if (dir === "left"){
				box.setSelectionRange(box.selectionStart === box.selectionEnd ? 
										box.selectionStart - 1 : box.selectionStart,
										box.selectionEnd - 1);
			} else if (dir === "right"){
				box.setSelectionRange(box.selectionStart === box.selectionEnd ? 
										box.selectionStart + 1 : box.selectionStart,
										box.selectionEnd + 1);
			}
		}
		
		if(key === LEFT_ARROW_KEYCODE){
			if (crsr >= 1 && txt[crsr] === "\n" && txt[crsr-1] === ZERO_WIDTH_SPACE){
				// if we start inside the softbreak move the cursor left
				shiftCursorOnce(box,"left");
				if (crsr > 1 && txt[crsr-2] === ZERO_WIDTH_SPACE){
					//if there's also a hidden space move the cursor left again
					shiftCursorOnce(box,"left");
				}
			}
			dir = "left";
		} else if(key === RIGHT_ARROW_KEYCODE){
			if (crsr + 1 < txt.length && txt[crsr] === ZERO_WIDTH_SPACE){
				//if we start to the left of a zero width space
				if (txt[crsr+1] === "\n"){
					//if we start to the left of a soft-wrap
					shiftCursorOnce(box,"right");
				} else if(crsr + 2 < txt.length && 
							txt[crsr+1] === ZERO_WIDTH_SPACE && txt[crsr+2] === "\n"){
					//if we start to the left of a zws + softwrap
					shiftCursorOnce(box,"right");
					shiftCursorOnce(box,"right");
				}
			}
			dir = "right";
		}
		if (crsr >= 1 && txt[crsr] === ZERO_WIDTH_SPACE && txt[crsr-1] === ZERO_WIDTH_SPACE
					&& txt.length > crsr+1 && txt[crsr+1] === "\n"){
			// if we start between a hidden space and a softbreak
			shiftCursorOnce(box,dir);
			// (key is arrowLeft or arrowRight) checked inside function
		}
	
	}
	
	// <summary>Wrapper for paste and word wrapping.</summary>
	// <param name="box">HTML textarea to monitor.</param>
	// <returns> void </returns>
	this.SizedInpPaste = function(box){
		// Capture state of the box before paste happens.
		var charPerLnLmt = box.getAttribute("data-mcm-cols");
		charPerLnLmt = parseInt(charPerLnLmt) ? parseInt(charPerLnLmt) : 0;
		var lnLmt = box.getAttribute("data-mcm-rows");
		lnLmt = parseInt(lnLmt) ? parseInt(lnLmt) : 0;
		var prevTxt = box.value;
		var prevLen = box.value.length;
		// get text that has been highlighted
		var sel = getSelection(box);
				
		// Move cursor outside of a soft break to keep it invisible to users.
		// This is not as strict as it could be, but it doens't need to be strict.
		if (sel.start > 0 && prevTxt[sel.start] === "\n" && prevTxt[sel.start-1] === ZERO_WIDTH_SPACE){
			sel.start --;
		}
		if (sel.end > 0 && prevTxt[sel.end] === "\n" && prevTxt[sel.end-1] === ZERO_WIDTH_SPACE){
			sel.end --;
		}	
		box.setSelectionRange(sel.start,sel.end);
		
		var sel = box.value.slice(sel.start,sel.end);
		// Sleep until after the paste has happened so we can read what was pasted.
		// Otherwise we'd have to look into the clipboard which is difficult.
		window.setTimeout(function(){
			var newTxt = box.value;
			var pastedTxt = newTxt.slice(sel.start, newTxt.length - (prevLen - sel.length));
			// Wrap new contents of box
			var txt = wrapAlgthm(newTxt,charPerLnLmt);
			if (verifyDimensions(txt,lnLmt)){
				box.value = txt;
				//update cursor position
				setCursorPosn(box,sel.start + pastedTxt.length);
			} else {
				box.value = prevTxt;
				setCursorPosn(box,sel.start);
			}
		});
	}
	
	//------------------------------------------------------------
    // Summary: trkSrchValSlct
    // Input:   Tracks value clicks for SrchTrkr.
    //------------------------------------------------------------
    var trkSrchValSlct = function (act, attr, val, cntxtNm, prodAttrId, prodValId, inpElem) {
		
		// Determine the customer's action 
		if (act === "Selected spec" || act === "Expanded" || act === "Collapsed") {
            var srchTrkInfo = new SrchTrkr.SrchDat({ usr: SrchTrkr.UsrActTyps.SLCT });
        } else if (act === "Deselected spec") {
            var srchTrkInfo = new SrchTrkr.SrchDat({ usr: SrchTrkr.UsrActTyps.DESLCT });
        } else if (act) {
            var srchTrkInfo = new SrchTrkr.SrchDat({ usr: act });
        }
		
		// Determine the type of element that was acted upon
		if (act === "Expanded") {
			srchTrkInfo.usr.elemTyp = SrchTrkr.ElemTyps.ATTR_SHOW_LNK;
		} else if (act === "Collapsed") {
			srchTrkInfo.usr.elemTyp = SrchTrkr.ElemTyps.ATTR_HIDE_LNK;
		} else {
			srchTrkInfo.usr.elemTyp = SrchTrkr.ElemTyps.SPEC;
		}
		
		// Create the search tracker object
        if (srchTrkInfo) {
			srchTrkInfo.usr.srcNm = getSrcNmFrmCntxt(cntxtNm);
            srchTrkInfo.usr.spec = { attr: attr, val: val };
			if (prodAttrId) {
				srchTrkInfo.usr.specIds = { attrId: prodAttrId, valId: prodValId};
			}
			if (inpElem && srchTrkInfo.usr.elemTyp === SrchTrkr.ElemTyps.SPEC) {
				srchTrkInfo.usr.slctdElemXYPosn = Cmn.GetXOffset(inpElem) + "," + Cmn.GetYOffset(inpElem);
			}
            srchTrkInfo.Trk();
        }
    }


    //------------------------------------------------------------
    // Summary: Returns true if you can type into the given input element.
    // Input:   Markup element
    //------------------------------------------------------------
    var getVldCntxtSrchBx = function (inpElem) {

        if (Cmn.HasCls(inpElem, "SpecSrch_CntxtSrchBx")) {
            return inpElem;
        } else {
            return null;
        }
    };

    //------------------------------------------------------------
    // Summary: Performs the contextual search.
    // Input:   Markup element
    //------------------------------------------------------------
    var procssCntxtSrch = function (inpElem, inpKeyCode, cntxtNm, webPartLoader) {

        var prodAttrId = getProdAttrIdFrmTxt(inpElem.id);
        var pubAttrId = getPubAttrIdFrmTxt(inpElem.id);

        var rootProdAttrId = prodAttrId;
        var rootPubAttrId = pubAttrId;
        var relAttribute = inpElem.getAttribute("rel");
        if (relAttribute) {
            var attrIds = relAttribute.split(":")[1];
            rootProdAttrId = attrIds.split("_")[0];
            rootPubAttrId = attrIds.split("_")[1];
        }

        // When a contextual search is performed, we want the first value selection
        // to collapse the attribute. If the customer expands the attribute and changes 
        // the contextual search, we want to prevent subsequent interactions with the
        // attribute from collapsing it. We will instead collapse when the customer 
        // has moved on to a different attribute.   
        if (Cmn.Utilities.Empty(SpecSrchInp.Get().GetAttrSlctdVals(rootProdAttrId, cntxtNm))) {
            //Do nothing
        } else {
            SpecSrchInp.Get().SetExplicitlyExpandedAttr(rootPubAttrId).UpdateSession();
        }


        //If the escape key was hit then clear out the contextual search box
        if (inpKeyCode == 27) {
            inpElem.value = "";

            //Immediately abort any stale requests
            if (webPartLoader && typeof webPartLoader.AbortStaleReq === "function") {
                webPartLoader.AbortStaleReq();
            }
        }

        //Get the contextual search argument
        var cntxtSrchArgTxt = inpElem.value;

        //If there's a difference in the argument string, one should trigger a push
        // This is also to filter out keystrokes like the Alt or Ctrl key
        var sesnSpecInp = SpecSrchInp.Get();
        if (sesnSpecInp.GetCntxtSrchChgd(prodAttrId, cntxtSrchArgTxt, cntxtNm)) {
            //Immediately abort any stale requests
            if (webPartLoader && typeof webPartLoader.AbortStaleReq === "function") {
                webPartLoader.AbortStaleReq();
            }

            //Reset the load indicator because an action has occurred
            McMaster.SesnMgr.SetStVal(StValDefs.ChooseSpecsLoadFrmSesnInd.KyTxt(), false);

            //Save the position of the contextual search box so that we can keep it in view
            SpecSrchWebPart.MaintainFocus.SavePosn(inpElem);

            if (mContextualSrchTimeout) {
                // there's already a request queued up. it's stale.  clear it out.
                clearTimeout(mContextualSrchTimeout);
                mContextualSrchTimeout = null;
            }

            // Immediately update the contextual search information
            // Even though a subsequent keystroke might come quickly and prevent the contextual search
            // for this argument from actually being performed, we'll still save the data off in
            // Session Manager.  It can be useful for "rolling back" from a null result set to a previous
            // search argument.
            //
            // Example:
            //  1. User types "1" - saved to session, not sent to server
            //  2. User quickly types "x" - saved to session.
            //  3. User pauses.  Contextual search for "1x" performed.  No results found.  Server rolls back to "1".
            sesnSpecInp.AddCntxtSrch(prodAttrId, pubAttrId, cntxtSrchArgTxt, cntxtNm).UpdateSession();

            var tempFunc = function () {
                //Begin a new set of timers
				var top = McMasterCom.Nav.GetTopFrame();
                var trkEvnt = new top.PerfTracker.Evnt(top.PerfTracker.EvntNms.SpecIntCntxtSrch, top.PerfTracker.PgCntxtNms.DynCntnt);
                // Publish the spec selected message
                sesnSpecInp.PubMsg();

                //Track the contextual search
                me.Webreports_TrkContextualSrch(cntxtNm, rootPubAttrId, cntxtSrchArgTxt, inpElem.value, rootProdAttrId);
            };

            if (inpKeyCode == 8) {
                // backspace
                // use longer timeout
                mContextualSrchTimeout = setTimeout(tempFunc, CONTEXTUAL_SRCH_KEYSTROKE_BACKSPACE_TIMEOUT_MS_NBR);
            } else {
                mContextualSrchTimeout = setTimeout(tempFunc, CONTEXTUAL_SRCH_KEYSTROKE_DEFLT_TIMEOUT_MS_NBR);
            }

        } else if (inpKeyCode == 9) {
            // Key code for a tab so that we remember where the user was inputting text
            // while they tab around. 
            // Save the position of the contextual search box so that we can keep it in view
            SpecSrchWebPart.MaintainFocus.SavePosn(inpElem);
        } else {
            // value of contextual search box has not changed
            // ignore
        }
    };
    //------------------------------------------------------------
    // Summary: Performs the contextual search.
    // Input:   Markup element
    //------------------------------------------------------------
    var procssItmPrsnttnCntxtSrch = function (inpElem, inpKeyCode, cntxtNm, webPartLoader) {
        var prodAttrId = getProdAttrIdFrmTxt(inpElem.id);
        var pubAttrId = getPubAttrIdFrmTxt(inpElem.id);
        var rootProdAttrId = prodAttrId;
        var rootPubAttrId = pubAttrId;
        var relAttribute = inpElem.getAttribute("rel");
		if (relAttribute) {
            var attrIds = relAttribute.split(":")[1];
            rootProdAttrId = attrIds.split("_")[0];
            rootPubAttrId = attrIds.split("_")[1];
        }
		
		var partNbrLnks = Cmn.GetElementsByClsNm("PartNbr");	
		var partNbrLnk;
		if (partNbrLnks.length > 0){
			for (var i=0; i<partNbrLnks.length; i++){
				if (!Cmn.HasCls(partNbrLnks[i], "printver")){
					partNbrLnk = partNbrLnks[i];
					break;
				}
			}
		}
		var attrcompitmids = partNbrLnk.getAttribute("data-mcm-attr-comp-itm-ids");
        // When a contextual search is performed, we want the first value selection
        // to collapse the attribute. If the customer expands the attribute and changes 
        // the contextual search, we want to prevent subsequent interactions with the
        // attribute from collapsing it. We will instead collapse when the customer 
        // has moved on to a different attribute.   
        if (Cmn.Utilities.Empty(SpecSrchInp.Get().GetAttrSlctdVals(rootProdAttrId, cntxtNm))) {
            //Do nothing
        } else {
            SpecSrchInp.Get().SetExplicitlyExpandedAttr(rootPubAttrId).UpdateSession();
        }
        //If the escape key was hit then clear out the contextual search box
        if (inpKeyCode == 27) {
            inpElem.value = "";
            //Immediately abort any stale requests
			if (webPartLoader && typeof webPartLoader.AbortStaleReq === "function") {
				webPartLoader.AbortStaleReq();
            }
        }
        //Get the contextual search argument
        var cntxtSrchArgTxt = inpElem.value;
        //If there's a difference in the argument string, one should trigger a push
        // This is also to filter out keystrokes like the Alt or Ctrl key
        var sesnSpecInp = SpecSrchInp.Get();
        if (sesnSpecInp.GetCntxtSrchChgd(prodAttrId, cntxtSrchArgTxt, cntxtNm)) {
            //Immediately abort any stale requests
            if (webPartLoader && typeof webPartLoader.AbortStaleReq === "function") {
				webPartLoader.AbortStaleReq();
            }
            //Reset the load indicator because an action has occurred
            McMaster.SesnMgr.SetStVal(StValDefs.ChooseSpecsLoadFrmSesnInd.KyTxt(), false);
            //Save the position of the contextual search box so that we can keep it in view
            SpecSrchWebPart.MaintainFocus.SavePosn(inpElem);
            if (mContextualSrchTimeout) {
                // there's already a request queued up. it's stale.  clear it out.
                clearTimeout(mContextualSrchTimeout);
                mContextualSrchTimeout = null;
            }
            // Immediately update the contextual search information
            // Even though a subsequent keystroke might come quickly and prevent the contextual search
            // for this argument from actually being performed, we'll still save the data off in
            // Session Manager.  It can be useful for "rolling back" from a null result set to a previous
            // search argument.
            //
            // Example:
            //  1. User types "1" - saved to session, not sent to server
            //  2. User quickly types "x" - saved to session.
            //  3. User pauses.  Contextual search for "1x" performed.  No results found.  Server rolls back to "1".
            sesnSpecInp.AddCntxtSrch(prodAttrId, pubAttrId, cntxtSrchArgTxt, cntxtNm).UpdateSession();
            var tempFunc = function () {
				var attrNmsTxt = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.OldStylAttrNms.KyTxt());
                var attrValsTxt = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.OldStylValTxts.KyTxt());
				var qtyInpBx = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_InpBx", "input", Cmn.GetObj("ItmPrsnttnWebPart"))[0];
                //Begin a new set of timers
				var top = McMasterCom.Nav.GetTopFrame();
                var trkEvnt = new top.PerfTracker.Evnt(top.PerfTracker.EvntNms.SpecIntCntxtSrch, top.PerfTracker.PgCntxtNms.DynCntnt);
				//Publish spec selected message
				var msgHdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.ITM_PRSNTTN);
			    McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.ItmPrsnttnSpecSlctd(msgHdr, attrNmsTxt, attrValsTxt, null, qtyInpBx.value, false, attrcompitmids));    
                //Track contextual search
			    me.Webreports_TrkContextualSrch(cntxtNm, rootPubAttrId, cntxtSrchArgTxt, inpElem.value, rootProdAttrId);
            };
            if (inpKeyCode == 8) {
                // backspace
                // use longer timeout
                mContextualSrchTimeout = setTimeout(tempFunc, CONTEXTUAL_SRCH_KEYSTROKE_BACKSPACE_TIMEOUT_MS_NBR);
            } else {
                mContextualSrchTimeout = setTimeout(tempFunc, CONTEXTUAL_SRCH_KEYSTROKE_DEFLT_TIMEOUT_MS_NBR);
            }
        } else if (inpKeyCode == 9) {
            // Key code for a tab so that we remember where the user was inputting text
            // while they tab around. 
            // Save the position of the contextual search box so that we can keep it in view
            SpecSrchWebPart.MaintainFocus.SavePosn(inpElem);
        } else {
            // value of contextual search box has not changed
            // ignore
        }
    };
    //------------------------------------------------------------
    // Summary: Performs the contextual search.
    // Input:   Markup element
    //------------------------------------------------------------
    var procssInLnCntxtSrch = function (inpElem, inpKeyCode, cntxtNm, webPartLoader) {

        var prodAttrId = getProdAttrIdFrmTxt(inpElem.id);
        var pubAttrId = getPubAttrIdFrmTxt(inpElem.id);

        var rootProdAttrId = prodAttrId;
        var rootPubAttrId = pubAttrId;
        var relAttribute = inpElem.getAttribute("rel");
        if (relAttribute) {
            var attrIds = relAttribute.split(":")[1];
            rootProdAttrId = attrIds.split("_")[0];
            rootPubAttrId = attrIds.split("_")[1];
        }
        var inLnSpecId = Cmn.GetAncestorByClsNm(inpElem, "InLnOrdWebPartAttrCntnr").getAttribute("data-InLnSpecId");
        var inLnSpecDict = McMaster.SesnMgr.GetStVal(StValDefs.InLnSpecUsrInps.KyTxt());
        //inLnSpecInp = inLnSpecDict[inLnSpecId];
        // McMaster.SesnMgr.SetStVal(StValDefs.InLnSpecUsrInps.KyTxt(), inLnSpecDict);

        // When a contextual search is performed, we want the first value selection
        // to collapse the attribute. If the customer expands the attribute and changes 
        // the contextual search, we want to prevent subsequent interactions with the
        // attribute from collapsing it. We will instead collapse when the customer 
        // has moved on to a different attribute.   
        if (Cmn.Utilities.Empty(inLnSpecDict[inLnSpecId].GetAttrSlctdVals(rootProdAttrId, cntxtNm))) {
            //Do nothing
        } else {
            inLnSpecDict[inLnSpecId].SetExplicitlyExpandedAttr(rootPubAttrId);
        }


        //If the escape key was hit then clear out the contextual search box
        if (inpKeyCode == 27) {
            inpElem.value = "";

            //Immediately abort any stale requests
            if (webPartLoader && typeof webPartLoader.AbortStaleReq === "function") {
                webPartLoader.AbortStaleReq();
            }
        }

        //Get the contextual search argument
        var cntxtSrchArgTxt = inpElem.value;

        //If there's a difference in the argument string, one should trigger a push
        // This is also to filter out keystrokes like the Alt or Ctrl key
        //var sesnSpecInp = inLnSpecInp;
        if (inLnSpecDict[inLnSpecId].GetCntxtSrchChgd(prodAttrId, cntxtSrchArgTxt, cntxtNm)) {
            //Immediately abort any stale requests
            if (webPartLoader && typeof webPartLoader.AbortStaleReq === "function") {
                webPartLoader.AbortStaleReq();
            }

            //Reset the load indicator because an action has occurred
            McMaster.SesnMgr.SetStVal(StValDefs.ChooseSpecsLoadFrmSesnInd.KyTxt(), false);

            //Save the position of the contextual search box so that we can keep it in view
            SpecSrchWebPart.MaintainFocus.SavePosn(inpElem);

            if (mContextualSrchTimeout) {
                // there's already a request queued up. it's stale.  clear it out.
                clearTimeout(mContextualSrchTimeout);
                mContextualSrchTimeout = null;
            }

            // Immediately update the contextual search information
            // Even though a subsequent keystroke might come quickly and prevent the contextual search
            // for this argument from actually being performed, we'll still save the data off in
            // Session Manager.  It can be useful for "rolling back" from a null result set to a previous
            // search argument.
            //
            // Example:
            //  1. User types "1" - saved to session, not sent to server
            //  2. User quickly types "x" - saved to session.
            //  3. User pauses.  Contextual search for "1x" performed.  No results found.  Server rolls back to "1".
            //sesnSpecInp.AddCntxtSrch(prodAttrId, pubAttrId, cntxtSrchArgTxt, cntxtNm).UpdateSession();
            inLnSpecDict[inLnSpecId].AddCntxtSrch(prodAttrId, pubAttrId, cntxtSrchArgTxt, cntxtNm);
            McMaster.SesnMgr.SetStVal(StValDefs.InLnSpecUsrInps.KyTxt(), inLnSpecDict);
            var tempFunc = function () {
                //Begin a new set of timers
				var top = McMasterCom.Nav.GetTopFrame();
                var trkEvnt = new top.PerfTracker.Evnt(top.PerfTracker.EvntNms.SpecIntCntxtSrch, top.PerfTracker.PgCntxtNms.DynCntnt);
				
				var itmBx = Cmn.GetAncestorByClsNm(inpElem, "AddToOrdFlow_ItmBx");
				var partNbrTxt;
				var partNbrRow; 
				if (itmBx){
					partNbrRow = Cmn.GetPrevSibling(Cmn.GetPrevSibling(itmBx));
					var itmBxCell = itmBx.children[0];
					if (itmBxCell){
						var lastIdx = itmBxCell.id.split("_").length - 1;
						partNbrTxt = itmBxCell.id.split("_")[lastIdx];
					}
				}
				
				var partNbrLnk;
				if (partNbrTxt && partNbrRow){
					var testMthd = function(elem) {
						if (Cmn.HasCls(elem, "PartNbrLnk") &&
							elem.innerHTML == partNbrTxt){
								return true;
						}
					}
					partNbrLnk = Cmn.GetElementBy(testMthd, "A", partNbrRow);
				}
    
				InLnOrdWebPart.updtSpecAttr(inLnSpecId, partNbrLnk);

                //Track the contextual search
                me.Webreports_TrkContextualSrch(cntxtNm, rootPubAttrId, cntxtSrchArgTxt, inpElem.value, rootProdAttrId);
            };

            if (inpKeyCode == 8) {
                // backspace
                // use longer timeout
                mContextualSrchTimeout = setTimeout(tempFunc, CONTEXTUAL_SRCH_KEYSTROKE_BACKSPACE_TIMEOUT_MS_NBR);
            } else {
                mContextualSrchTimeout = setTimeout(tempFunc, CONTEXTUAL_SRCH_KEYSTROKE_DEFLT_TIMEOUT_MS_NBR);
            }

        } else if (inpKeyCode == 9) {
            // Key code for a tab so that we remember where the user was inputting text
            // while they tab around. 
            // Save the position of the contextual search box so that we can keep it in view
            SpecSrchWebPart.MaintainFocus.SavePosn(inpElem);
        } 
    };
    //------------------------------------------------------------
    // Summary: Performs the contextual search.
    // Input:   Markup element
    //------------------------------------------------------------
    var procssOrdPadLnCntxtSrch = function (inpElem, inpKeyCode, cntxtNm, webPartLoader) {

        var prodAttrId = getProdAttrIdFrmTxt(inpElem.id);
        var pubAttrId = getPubAttrIdFrmTxt(inpElem.id);

        var rootProdAttrId = prodAttrId;
        var rootPubAttrId = pubAttrId;
        var relAttribute = inpElem.getAttribute("rel");
        if (relAttribute) {
            var attrIds = relAttribute.split(":")[1];
            rootProdAttrId = attrIds.split("_")[0];
            rootPubAttrId = attrIds.split("_")[1];
        }
        var partNbrCol = Cmn.GetPrevSibling(Cmn.GetAncestorByClsNm(inpElem, "OrdPadProdsWebPartLayout_PartDscCell"));
        var partNbrTxt = Cmn.GetFrstChld(Cmn.GetFrstChldByClsNm(partNbrCol, "OrdPadProdsWebPart_ShowOnPending")).value;
        var lnSeqNbr = getLnSeqFrmLnElem(inpElem);
        var ordPadSpecId = partNbrTxt + "_" + lnSeqNbr;
        if (McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.OrdLnSpecUsrInps.KyTxt()) == null) {
            var ordLnSpecInpDict = {};
            ordLnSpecInpDict[ordPadSpecId] = SpecSrchInp.RemAll();
            McMaster.SesnMgr.SetStVal(StValDefs.OrdLnSpecUsrInps.KyTxt(), ordLnSpecInpDict);
        }
        var ordLnSpecInpDict = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.OrdLnSpecUsrInps.KyTxt());
        if (ordPadSpecId in ordLnSpecInpDict) {
        } else {
            ordLnSpecInpDict[ordPadSpecId] = SpecSrchInp.RemAll();
        }


        // When a contextual search is performed, we want the first value selection
        // to collapse the attribute. If the customer expands the attribute and changes 
        // the contextual search, we want to prevent subsequent interactions with the
        // attribute from collapsing it. We will instead collapse when the customer 
        // has moved on to a different attribute.   
        if (Cmn.Utilities.Empty(ordLnSpecInpDict[ordPadSpecId].GetAttrSlctdVals(rootProdAttrId, cntxtNm))) {
            //Do nothing
        } else {
            ordLnSpecInpDict[ordPadSpecId].SetExplicitlyExpandedAttr(rootPubAttrId);
        }


        //If the escape key was hit then clear out the contextual search box
        if (inpKeyCode == 27) {
            inpElem.value = "";

            //Immediately abort any stale requests
            if (webPartLoader && typeof webPartLoader.AbortStaleReq === "function") {
                webPartLoader.AbortStaleReq();
            }
        }

        //Get the contextual search argument
        var cntxtSrchArgTxt = inpElem.value;

        //If there's a difference in the argument string, one should trigger a push
        // This is also to filter out keystrokes like the Alt or Ctrl key
        //var sesnSpecInp = inLnSpecInp;
        if (ordLnSpecInpDict[ordPadSpecId].GetCntxtSrchChgd(prodAttrId, cntxtSrchArgTxt, cntxtNm)) {
            //Immediately abort any stale requests
            if (webPartLoader && typeof webPartLoader.AbortStaleReq === "function") {
                webPartLoader.AbortStaleReq();
            }

            //Reset the load indicator because an action has occurred
            McMaster.SesnMgr.SetStVal(StValDefs.ChooseSpecsLoadFrmSesnInd.KyTxt(), false);

            //Save the position of the contextual search box so that we can keep it in view
            SpecSrchWebPart.MaintainFocus.SavePosn(inpElem);

            if (mContextualSrchTimeout) {
                // there's already a request queued up. it's stale.  clear it out.
                clearTimeout(mContextualSrchTimeout);
                mContextualSrchTimeout = null;
            }

            // Immediately update the contextual search information
            // Even though a subsequent keystroke might come quickly and prevent the contextual search
            // for this argument from actually being performed, we'll still save the data off in
            // Session Manager.  It can be useful for "rolling back" from a null result set to a previous
            // search argument.
            //
            // Example:
            //  1. User types "1" - saved to session, not sent to server
            //  2. User quickly types "x" - saved to session.
            //  3. User pauses.  Contextual search for "1x" performed.  No results found.  Server rolls back to "1".
            //sesnSpecInp.AddCntxtSrch(prodAttrId, pubAttrId, cntxtSrchArgTxt, cntxtNm).UpdateSession();
            ordLnSpecInpDict[ordPadSpecId].AddCntxtSrch(prodAttrId, pubAttrId, cntxtSrchArgTxt, cntxtNm);
            McMaster.SesnMgr.SetStVal(StValDefs.OrdLnSpecUsrInps.KyTxt(), ordLnSpecInpDict);
            var tempFunc = function () {
                //Begin a new set of timers
				var top = McMasterCom.Nav.GetTopFrame();
                var trkEvnt = new top.PerfTracker.Evnt(top.PerfTracker.EvntNms.SpecIntCntxtSrch, top.PerfTracker.PgCntxtNms.DynCntnt);
                var MSG_HDR = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.ORD_PAD);
                McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.OrdPadLnSpecSlctd(MSG_HDR, lnSeqNbr, partNbrTxt));

                //Track the contextual search
                me.Webreports_TrkContextualSrch(cntxtNm, rootPubAttrId, cntxtSrchArgTxt, inpElem.value, rootProdAttrId);
            };

            if (inpKeyCode == 8) {
                // backspace
                // use longer timeout
                mContextualSrchTimeout = setTimeout(tempFunc, CONTEXTUAL_SRCH_KEYSTROKE_BACKSPACE_TIMEOUT_MS_NBR);
            } else {
                mContextualSrchTimeout = setTimeout(tempFunc, CONTEXTUAL_SRCH_KEYSTROKE_DEFLT_TIMEOUT_MS_NBR);
            }

        } else if (inpKeyCode == 9) {
            // Key code for a tab so that we remember where the user was inputting text
            // while they tab around. 
            // Save the position of the contextual search box so that we can keep it in view
            SpecSrchWebPart.MaintainFocus.SavePosn(inpElem);
        } else {
            // value of contextual search box has not changed
            // ignore
            McMaster.SesnMgr.SetStVal(StValDefs.OrdLnSpecUsrInps.KyTxt(), ordLnSpecInpDict);
            var MSG_HDR = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.ORD_PAD);
            McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.OrdPadLnSpecSlctd(MSG_HDR, lnSeqNbr, partNbrTxt));
        }
    };
    //------------------------------------------------------------
    // Summary: Handles the mouseover event
    // Input:   The YUI event
    //          e - the event object
    //          webPartLoader - The loader for this web
    //               part. If it exists, call the method on the loader
    //               that determines whether a request is already in 
    //               flight. If so, ignore the current mouseover event.
    //          cntnr - the container in which the web part is loaded
    //------------------------------------------------------------
    var hndlMouseOvrEvnt = function (e, cntxtNm, webPartLoader, cntnr) {
        if (webPartLoader && typeof webPartLoader.ReqInFlight === "function" && webPartLoader.ReqInFlight()) {
            // Don't listen to mouseover events when a request is in flight
        } else {
            var contInd = true;
            if (cntxtNm.toUpperCase() == "LANDINGPAGE") {
                var targetElem = Cmn.GetEvntTarget(e);
                var relTargetElem = Cmn.GetEvntRelatedTarget(e);

                if ((Cmn.GetAncestorByClsNm(targetElem, "LandingPage_DeepLnksCntnr") || Cmn.HasCls(targetElem, "LandingPage_DeepLnksCntnr")) && !(Cmn.GetAncestorByClsNm(targetElem, "LandingPage_DeepLnkVal") || Cmn.HasCls(targetElem, "LandingPage_DeepLnkVal"))) {
                    contInd = false;
                }
                //                while (relTargetElem && relTargetElem != targetElem && relTargetElem.nodeName.toUpperCase() != 'DIV' && relTargetElem.nodeName.toUpperCase() != 'LI'
                //                && !(Cmn.HasCls("LandingPage_DeepLnksList", relTargetElem))) {
                //                    relTargetElem = relTargetElem.parentNode;
                //                }
                //                if (relTargetElem == targetElem){
                //                    contInd = false;
                //                }
                //                if (relTargetElem && targetElem && Cmn.HasCls("LandingPage_DeepLnksList", relTargetElem) &&
                //                    Cmn.IsAncestor(relTargetElem, targetElem)){
                //                    contInd = false;
                //                }
            }
            if (contInd) {

                // Handler the mouseover
                hndlHoverEvnt(e, cntxtNm, true, cntnr);
            }
        }
    };

    //------------------------------------------------------------
    // Summary: Handles the mouseout event
    // Input:   The YUI event
    //          e - the event object        
    //          webPartLoader - The loader for this web
    //               part. If it exists, call the method on the loader
    //               that determines whether a request is already in 
    //               flight. If so, ignore the current mouseout event.
    //          cntnr - the container in which the web part is loaded       
    //------------------------------------------------------------
    var hndlMouseOutEvnt = function (e, cntxtNm, webPartLoader, cntnr) {

        if (webPartLoader && typeof webPartLoader.ReqInFlight === "function" && webPartLoader.ReqInFlight()) {
            // Don't listen to mouseout events when a request is in flight
        } else {

            var contInd = true;
            if (cntxtNm.toUpperCase() == "LANDINGPAGE") {
                var targetElem = Cmn.GetEvntTarget(e);
                var relTargetElem = Cmn.GetEvntRelatedTarget(e);

                //                if (Cmn.GetAncestorByClsNm(targetElem, "LandingPage_DeepLnksList") && Cmn.GetAncestorByClsNm(targetElem, "LandingPage_DeepLnksList")){
                //                
                //                }
                while (relTargetElem && relTargetElem != targetElem && relTargetElem.nodeName.toUpperCase() != 'DIV' && relTargetElem.nodeName.toUpperCase() != 'LI'
                && !(getVldClickElem(relTargetElem) || Cmn.GetAncestorBy(relTargetElem, getVldClickElem))) {
                    //&& !(Cmn.HasCls("LandingPage_DeepLnksList", relTargetElem))) {
                    relTargetElem = relTargetElem.parentNode;
                }
                if (relTargetElem == targetElem) {
                    contInd = false;
                }
                //                if (relTargetElem && targetElem && Cmn.HasCls("LandingPage_DeepLnksList", relTargetElem) &&
                //                    Cmn.IsAncestor(relTargetElem, targetElem)){
                //                    contInd = false;
                //                }
            }
            if (contInd) {
                // Handler the mousout
                hndlHoverEvnt(e, cntxtNm, false, cntnr);
            }
        }
    };

    //------------------------------------------------------------
    // Summary: Handles the mouseover and mouseout events
    // Input:   The YUI event
    //------------------------------------------------------------
    var hndlHoverEvnt = function (e, cntxtNm, hoverInd, cntnr) {

        if (e) {
            // An element is only "hoverable" if it's "clickable"
            var targetElem = Cmn.GetEvntTarget(e);

            var relTargetElem = Cmn.GetEvntRelatedTarget(e);

            if (cntxtNm.toUpperCase() == "LANDINGPAGE") {

                if (targetElem && (targetElem.nodeName.toUpperCase() != "DIV" && targetElem.nodeName.toUpperCase() != "LI")) {

                    while (targetElem.parentNode) {
                        if (targetElem && (targetElem.nodeName.toUpperCase() != "DIV" && targetElem.nodeName.toUpperCase() != "LI")) {
                            targetElem = targetElem.parentNode;
                        } else {
                            break;
                        }
                    }
                }
            }


            var vldInpElem = getVldClickElem(targetElem) || Cmn.GetAncestorBy(targetElem, getVldClickElem);

            // If it's hoverable then process the hover event
            if (vldInpElem) {
                // Process the event
                procssHoverEvnt(vldInpElem, cntxtNm, hoverInd);

                // Handle cursor behavior.  The cursor should be a pointer because the
                // user has just moused over a valid input element.  If the cursor isn't
                // already a pointer, change it.
                if (hoverInd && mCursorIsPointerInd === false) {
                    Cmn.SetStyle(cntnr, "cursor", "pointer");
                    mCursorIsPointerInd = true;
                }
            } else {
                // If the user has moused over something and it's NOT a valid
                // input element, then we know we need to change the cursor
                // BACK to the default.  Only do this if the cursor hasn't
                // already been changed back.
                if (hoverInd && mCursorIsPointerInd) {
                    Cmn.SetStyle(cntnr, "cursor", "");
                    mCursorIsPointerInd = false;
                }
            }
        }
    };

    //------------------------------------------------------------
    // Summary: Validates a clickable element or retrieves the 
    //          correct relative node.
    // Input:   The event's target element
    // Returns: A valid clickable element
    //------------------------------------------------------------
    var getVldClickElem = function (inpElem) {

        var rtnElem = null;

        if (inpElem) {
            switch (true) {
                case (getInpElemIsVal(inpElem)):
                case (getInpElemIsDropDwnBtn(inpElem)):
                case (getInpElemIsSpecInfoLnk(inpElem)):
                case (getInpElemIsClearAllLnk(inpElem)):
                case (getInpElemIsToggleLnk(inpElem)):
                case (getInpElemIsOptOutLnk(inpElem)):

                    if (getInpElemIsOptOutLnk(inpElem)) {
                        var envrNm = Cmn.GetEnvrNm();
                        if (envrNm == Cmn.APPL_ENVR_NMS.PUBDEV
                            || envrNm == Cmn.APPL_ENVR_NMS.PUBQUAL
                            || envrNm == Cmn.APPL_ENVR_NMS.PUB) {
                            rtnElem = inpElem;
                        } else {
                            //If we're handling the "Product Count" element and the
                            //environment is external, it won't be a clickable element.
                            //The "Opt-out" feature is only available internally.
                        }
                    } else {
                        rtnElem = inpElem;
                    }

                    break;

                case (getInpElemIsDeepLnkAttrInd(inpElem)):
                    //The clickable element (the valSpec's parent) is not
                    //an ancestor to the target element, so we have to 
                    //explicitly get the parent.
                    rtnElem = getParLnkWithDeepLnkAttrElem(inpElem, VAL_SPEC_PAR_ELEM_ID_CD.CAPTION);
                    break;

                default:
                    // no other elements are clickable;
            }
        }

        return rtnElem;
    };

    //------------------------------------------------------------
    // Summary: Processes the click event to update visuals as
    //          needed, send the appropriate values to session,
    //          and publish the needed messages
    // Input:   Validated click(ed) element
    //          maintainScrollPosnInd - Denotes whether we need to keep
    //               the selected value in the same position when the page
    //               gets re-loaded.
    //------------------------------------------------------------
    var procssClckEvnt = function (inpElem, cntxtNm, maintainScrollPosnInd) {

        //Process the click event
        switch (true) {
            case (getInpElemIsVal(inpElem)):
                //Process the val click event
                procssValClckEvnt(inpElem, cntxtNm, maintainScrollPosnInd);
				// Track the attribute that has been chosen
				if (cntxtNm == 'ChooseSpecs') {
					trkSlctdVal(inpElem);
				}
                break;

            case (getInpElemIsDropDwnBtn(inpElem)):
                //Toggle the dropdown
                procssDropDwnBtnClick(inpElem);
                break;

            case (getInpElemIsSpecInfoLnk(inpElem)):
                //The visitor has clicked on a general info link
                SpecSrchWebPart.SpecInfo.Click(inpElem, cntxtNm);
                break;

            case (getInpElemIsClearAllLnk(inpElem)):
                //The visitor has clicked the "Clear All" link
                procssClearAllLnkClick(inpElem, cntxtNm);
                break;

            case (getInpElemIsToggleLnk(inpElem)):
                // Click was on a show/hide link
                toggleAttrDisplSt(inpElem, cntxtNm);
                // Publish a message that the hide/show link has been selected
                var MSG_HDR = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.SPEC);
                McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.SpecToggleLnkSlctd(MSG_HDR));
                break;

            case (getInpElemIsOptOutLnk(inpElem)):

                var envrNm = Cmn.GetEnvrNm();

                if (envrNm == Cmn.APPL_ENVR_NMS.PUBDEV || envrNm == Cmn.APPL_ENVR_NMS.PUBQUAL
                    || envrNm == Cmn.APPL_ENVR_NMS.PUB) {

                    //Publish a message that the opt out link has been selected
                    var srchTxt = McMaster.SesnMgr.GetStVal(StValDefs.SlctdSrchRsltTxt.KyTxt());
                    var MSG_HDR = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.LANDING_PAGE);
                    McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.DynamicContentSlctd(MSG_HDR));
                } else {
                    //The "opt-out to catalog pages" feature is only activated for internal
                    //environments.
                }
                break;

            default:
                //Do nothing
                break;
        }
    };


    //------------------------------------------------------------
    // Summary: Toggles the state of the attribute associated with
    //          the clicked element (e.g. swaps to collapsed
    //          values if the current state is expanded).
    // Input:   Validated click(ed) element
    //------------------------------------------------------------      
    var toggleAttrDisplSt = function (inpElem, cntxtNm) {

        var attrCntnr = getAttrByInnerElem(inpElem);
        if (attrCntnr) {
            //If this attribute has an open SpecInfo presentation, get it.
            var openSpecInfo = SpecSrchWebPart.SpecInfo.GetOpenSpecInfoByAttrElem(attrCntnr);

            //Close all SpecInfo presentations.
            SpecSrchWebPart.SpecInfo.CloseAll();

            //Toggle the display of the attributes.
            var complementaryDisplStAttrCntnr = getComplementaryElemById(attrCntnr.id);
            Cmn.ReplaceCls(attrCntnr, "SpecSrch_AttrShow", "SpecSrch_AttrHide");
            Cmn.ReplaceCls(complementaryDisplStAttrCntnr, "SpecSrch_AttrHide", "SpecSrch_AttrShow");

            //If the attribute to display is a scrollable list, 
            //then scroll to the first selected value in the list
            scrollSlctdValsIntoView(complementaryDisplStAttrCntnr);

            //Track when customers manually expand/collapse attributes
            var pubAttrId = getPubAttrIdFrmTxt(attrCntnr.id);
            var prodAttrId = getProdAttrIdFrmTxt(attrCntnr.id);
            var trkAttrGrpNm = me.GetAttrNm(pubAttrId);
            var trkAct = "";
            if (attrCntnr.id.Contains("_C_")) {
                // CURRENT state of attribute container is COLLAPSED
                // The action just taken by the customer will EXPAND the attribute.         
                trkAct = "Expanded";
                // Record that the attribute was explicitly expanded            
                SpecSrchInp.Get().SetExplicitlyExpandedAttr(pubAttrId).UpdateSession();
            } else {
                trkAct = "Collapsed";

                // Note that the attribute was explicitly collapsed         
                SpecSrchInp.Get().RemExplicitlyExpandedAttr(pubAttrId).UpdateSession();
            }

            //If the customer clicked the "Show" link and a specInfo presentation was open at the time,
            //re-open the specInfo presentation such that it includes information for the new set of
            //values that are in scope.
            if (Cmn.GetTxtContent(inpElem) === "Show" && openSpecInfo) {
                SpecSrchWebPart.SpecInfo.LoadSpecInfo(openSpecInfo, null, cntxtNm);
            }

            SpecInteractions.Webreports_TrkAct(cntxtNm, trkAct, trkAttrGrpNm, null, false, prodAttrId, null, inpElem);
        }
    };
	
	
	//------------------------------------------------------------
    // Summary: Called when the user selects a value and publishes
	//			information a message containing information about
	//			that value.
    // Input:   Validated click(ed) element
    //------------------------------------------------------------
	var trkSlctdVal = function (inpElem) {
	
			// The values we want to track.
			var slctdAttrNmTxt = '';
			var slctdAttrPosNbr = 0;
			var slctdAttrAbvFoldInd = true;
		
			// Find the attribute corresponding to the clicked element.
			var slctdAttr = Cmn.GetAncestorByClsNm(inpElem, 'SpecSrch_Attribute');
			
			// Find the name of that attribute.
			var slctdAttrNmElems = Cmn.GetElementsByClsNm('SpecSrch_Lbl', 'th', slctdAttr);
			if (slctdAttrNmElems.length > 0) slctdAttrNmTxt = Cmn.GetTxtContent(slctdAttrNmElems[0]);
			
			// Find the position of the attribute amongst all attributes on the page.
			var allAttrs = Cmn.GetElementsByClsNm('SpecSrch_Attribute', 'div');
			for (i=0;i<allAttrs.length;i++) {
				if(allAttrs[i] == slctdAttr) {
					slctdAttrPosNbr = i + 1;
				}
			}
			
			// Determine whether the attribute was visible when the page loaded.
			
			var topPxNbr = slctdAttr.offsetTop; 
					// pixels from the top of the spec search to the top of the selected attribute
			var visiblePxNbr = 0;
			var specSrchInnerArr = Cmn.GetElementsByClsNm('SpecSrch_Inner');
			if (specSrchInnerArr.length > 0) visiblePxNbr = specSrchInnerArr[0].offsetHeight;
					// pixels from the top of the spec search to the bottom of the page
			if (topPxNbr < visiblePxNbr) {
				slctdAttrAbvFoldInd = true;
			} else {
				slctdAttrAbvFoldInd = false;
			}
			
			// Publish a message.
			var hdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.SPEC);
			var msg = new McMaster.MsgMgrMsgs.ProdInfoSlctd(hdr, 'SpecSrch', slctdAttrNmTxt, slctdAttrPosNbr, slctdAttrAbvFoldInd)
			McMaster.MsgMgr.PubMsg(msg);
			
	};

    //------------------------------------------------------------
    // Summary: Scrolls selected values into view within the given container.
    // Input:   Validated click(ed) element
    //------------------------------------------------------------
    var scrollSlctdValsIntoView = function (cntnrElem) {

        if (cntnrElem) {
            //If the attribute to display is a scrollable list, 
            //then scroll to the first selected value in the list
            var scrollCntnrs = Cmn.GetElementsByClsNm("SpecSrch_ScrollCntnr", "div", cntnrElem);
            for (cntnrIdx = 0; cntnrIdx < scrollCntnrs.length; cntnrIdx++) {
                var currCntnr = scrollCntnrs[cntnrIdx];
                var slctdVals = Cmn.GetElementsByClsNm("SpecSrch_SlctdVal", "td", currCntnr)
                                 || Cmn.GetElementsByClsNm("SpecSrch_SlctdVal", "tr", currCntnr);
                if (slctdVals && slctdVals.length > 0) {
                    Cmn.SetVerticalScrollPosn(currCntnr, (slctdVals[0].offsetTop - (currCntnr.offsetHeight / 3)));
                }
            }
        }
    };

    var getInpElem = function (inpElem, cntxtNm) {
        if (cntxtNm.toUpperCase() == "LANDINGPAGE") {
            while (inpElem) {
                if (inpElem.tagName == "li" || Cmn.HasCls(inpElem, LANDING_PG_ATTR_CLS_NM)) {
                    break;
                }
                inpElem = inpElem.parentNode;
            }
        }
        return inpElem;
    }

    var getLegacyCntntTrm = function (inpElem, cntxtNm) {
        var rtnTrmTxt = "";
        if (cntxtNm.toUpperCase() == "LANDINGPAGE") {
            if (inpElem) {
                var cntntTrm = inpElem.getAttribute("legacyCntntTrm");
                if (cntntTrm) {
                    rtnTrmTxt = cntntTrm;
                }
            }
        }
        return rtnTrmTxt;
    }


    //---------------------------------------------------------------------------
    // Summary: Completes processing of clickable element.
    // Input:   currSpecUsrInp      - spec search user inputs
    //          slctdElem        - The node that encapsulates the clickable element 
    //                             associated with the element selected by the user.
    //          srchTrmTxt       - Search term.
    //          imgCaptionTxt    - Image caption.
    //---------------------------------------------------------------------------
    var procssLegacySrchTrmClick = function (slctdElem, srchTrmTxt) {

        var elemHgt
              , landingPageNm
              , mainContentCntnr
              , McMaster_LoadMgr = McMaster.LoadMgr
              , McMaster_SesnMgr = McMaster.SesnMgr
              , McMaster_SesnMgr_SetStVal = McMaster_SesnMgr.SetStVal
              , McMaster_SesnMgr_StValDefs = McMaster_SesnMgr.StValDefs
              , belowTheFoldInd = false
              ;



        // Determine the height offset of the element that was selected so we can determine if 
        // it was above or below the fold (a.k.a - They had to scroll to find it to click on it).               
        mainContentCntnr = Cmn.GetObj(MAIN_CONTENT_CNTNR_NM);
        elemHgt = (slctdElem.offsetTop + slctdElem.offsetHeight);

        if (elemHgt > mainContentCntnr.offsetHeight) {
            belowTheFoldInd = true;
        }


        // Display the 'wait' indicator
        McMaster_LoadMgr.UnloadCntnr(MAIN_CONTENT_CNTNR_NM);
        McMaster_LoadMgr.ShowCntnr(MAIN_CONTENT_CNTNR_NM);
        McMaster_LoadMgr.DisplWaitIcon(MAIN_CONTENT_CNTNR_NM);

        // Create a message header
        var hdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.INTERMEDIATE_PRSNTTN);

        // Create a Search Submitted Message                
        var msg = new McMaster.MsgMgrMsgs.UsrInpTxtSubmitted(hdr, srchTrmTxt, "slct");

        // Publish the message
        McMaster.MsgMgr.PubMsg(msg);

        var srchTxt = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.SrchTxt.KyTxt());
    }

    //------------------------------------------------------------
    // Summary: Processes the act of selecting a value.
    // Input:   Validated click(ed) element
    //          maintainScrollPosnInd - Denotes whether we need to keep
    //               the selected value in the same position when the page
    //               gets re-loaded.
    //------------------------------------------------------------
    var procssValClckEvnt = function (inpElem, cntxtNm, maintainScrollPosnInd) {
        var prodAttrId = getProdAttrIdFrmTxt(inpElem.id);
        var prodValId = getProdValIdFrmTxt(inpElem.id);

        var pubAttrId = getPubAttrIdFrmTxt(inpElem.id);
        var pubValId = getPubValIdFrmTxt(inpElem.id);

        var legacyCntntTrm = getLegacyCntntTrm(inpElem, cntxtNm);
        if (legacyCntntTrm) {
            procssLegacySrchTrmClick(inpElem, legacyCntntTrm);
        } else {
            //Track the click-action
            var tmpAttrValNm = getCaptionLnkByInpElem(inpElem,cntxtNm).innerHTML.replace("<br>", " " );
            var trkAttrValNm = tmpAttrValNm.replace(/<.*?>/ig,"");
			trkAttrValNm = trkAttrValNm.replace("&nbsp;", "");
                                    
            var trkAttrGrpNm = me.GetAttrNm(pubAttrId);
            var trkAct = (SpecSrchInp.Get().ValExists(prodAttrId, prodValId, cntxtNm)) ? ACT.CLICK_SLCTD : ACT.CLICK_VLD;
            
            //If we clicked on a deep link we want to include it's container's attribute and value
            if ( Cmn.HasCls(inpElem, "LandingPage_DeepLnkVal") ) {
                var trkMsg = crteDeepLnkTrkMsg(inpElem,trkAttrValNm,trkAttrGrpNm);
                SpecInteractions.Webreports_TrkCustomAct(cntxtNm, trkAct, trkMsg);

                // TrkSrch wrapper
                trkSrchValSlct(trkAct, trkAttrGrpNm, trkAttrValNm, cntxtNm, prodAttrId, prodValId, inpElem);

            } else {
				var clsNm = SPEC_SRCH_ATTR_CLS_NM;
                if (cntxtNm == "LandingPage") {
					clsNm = LANDING_PG_ATTR_CLS_NM;
				}
				var ancstr = getAttrByInnerElem(inpElem, clsNm);
				var ancstrTrkAttrGrpNm = getClickedValParGrpNm(inpElem, ancstr);
                if (ancstrTrkAttrGrpNm !== trkAttrGrpNm) {
                	trkAttrGrpNm = ancstrTrkAttrGrpNm + " " + trkAttrGrpNm;
                }
                // TrkSrch is called from here as well
                SpecInteractions.Webreports_TrkAct(cntxtNm, trkAct, trkAttrGrpNm, trkAttrValNm.Trim(), false, prodAttrId, prodValId, inpElem);
            }
            
            //Reset the load indicator because an action has occurred
            McMaster.SesnMgr.SetStVal(StValDefs.ChooseSpecsLoadFrmSesnInd.KyTxt(), false);

            //Performance timer - Track the start of the click event
			var top = McMasterCom.Nav.GetTopFrame();
            var trkEvntPayload = new top.PerfTracker.EvntPayload();
            trkEvntPayload.Add("attrGrpNm", trkAttrGrpNm);
            trkEvntPayload.Add("attrValNm", trkAttrValNm);
            var trkEvnt = new top.PerfTracker.Evnt(top.PerfTracker.EvntNms.SpecIntValClick, top.PerfTracker.PgCntxtNms.DynCntnt, trkEvntPayload);

            //Figure out if the selected value is in a dropdown
            //before deciding what to do next
            if (getInpElemIsDropDwnVal(inpElem)) {
                // Process the dropdown click
                procssDropDwnValClick(prodAttrId, pubAttrId, prodValId, pubValId, inpElem, cntxtNm);
            } else if (prodAttrId && prodValId && cntxtNm != "InLnOrd" & cntxtNm != "OrdPad" & cntxtNm != McMaster.MsgMgr.CntxtNms.ITM_PRSNTTN) {
                // The visitor is interacting with a normal attribute.  
                // Toggle the filter, save it off to session, and publish a message
                SpecSrchInp.Get().ToggleVal(prodAttrId, pubAttrId, prodValId, pubValId, cntxtNm).UpdateSession().PubMsg();
            } else if (prodAttrId && prodValId && cntxtNm == McMaster.MsgMgr.CntxtNms.ITM_PRSNTTN){
				var attrNmsTxt = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.OldStylAttrNms.KyTxt());
                var attrValsTxt = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.OldStylValTxts.KyTxt());
				var qtyInpBx = Cmn.GetElementsByClsNm("InLnOrdWebPartLayout_InpBx", "input", Cmn.GetObj("ItmPrsnttnWebPart"))[0];
				var partNbrLnks = Cmn.GetElementsByClsNm("PartNbr");	
				var partNbrLnk;
				if (partNbrLnks.length > 0){
					for (var i=0; i<partNbrLnks.length; i++){
						if (!Cmn.HasCls(partNbrLnks[i], "printver")){
							partNbrLnk = partNbrLnks[i];
							break;
						}
					}
				}
				// The visitor is interacting with a normal attribute.  
                // Toggle the filter, save it off to session.
				SpecSrchInp.Get().ToggleVal(prodAttrId, pubAttrId, prodValId, pubValId, cntxtNm).UpdateSession();
				
				//Publish spec selected message
				var msgHdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.ITM_PRSNTTN);
			    McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.ItmPrsnttnSpecSlctd(msgHdr, attrNmsTxt, attrValsTxt, null, qtyInpBx.value, false, partNbrLnk.getAttribute("data-mcm-attr-comp-itm-ids")));    
				
            } else if (prodAttrId && prodValId && cntxtNm == "InLnOrd") {
                // The visitor is interacting with a normal attribute.  
                // Toggle the filter, save it off to session, and publish a message
                var CmnObjJs = null;
                if (chkCtlgPageInd()){
                    CmnObjJs = McMasterCom.Nav.GetTopFrame().MainIFrame.Catalog.Cmn;
                }else{
                    CmnObjJs = Cmn;
                }
                
                var seqNbr = CmnObjJs.GetAncestorByClsNm(inpElem, "InLnOrdWebPartAttrCntnr").getAttribute("data-mcm-partnbr-seqnbr");
                var inLnSpecId = CmnObjJs.GetAncestorByClsNm(inpElem, "InLnOrdWebPartAttrCntnr").getAttribute("data-inlnspecid");

                var inLnSpecDict = McMaster.SesnMgr.GetStVal(StValDefs.InLnSpecUsrInps.KyTxt());
                inLnSpecDict[inLnSpecId].ToggleVal(prodAttrId, pubAttrId, prodValId, pubValId, cntxtNm);
                
                var partNbrTxt = inLnSpecId.split('_')[0];
                var partNbrLnk = fndPartNbrLnkByClsNm(partNbrTxt, "AddToOrdBxCreated", seqNbr)
                var tblRow = CmnObjJs.GetAncestorByTagNm(CmnObjJs.GetAncestorByClsNm(partNbrLnk, "ItmTblCellPartNbr"), 'tr');
                var prdGrp = CmnObjJs.GetAncestorByClsNm(partNbrLnk, "ItmTblCellPartNbr").getAttribute("data-mcm-prodgrps")
                var parentRows = CmnObjJs.GetElementsByClsNm("ItmTblSpecLnk", "td", tblRow);

                for (var parentRowIdx = 0; parentRowIdx < parentRows.length; parentRowIdx++) {
                    var parentRow = parentRows[parentRowIdx];
                    if (parentRow.getAttribute("data-mcm-prodgrps")==prdGrp) {
                        var specChoiceSlctdLnks = CmnObjJs.GetElementsByClsNm("SpecChoiceSlctd", "a", parentRow);
                        var specChoiceLnks = CmnObjJs.GetElementsByClsNm("SpecChoiceLnk", "a", parentRow);
                        if (specChoiceLnks.length > 0) {
                            if (specChoiceLnks[0].getAttribute("data-mcm-prod-attr-id") == prodAttrId) {
                                for (var specChoiceLnkIdx = 0; specChoiceLnkIdx < specChoiceSlctdLnks.length; specChoiceLnkIdx++) {
                                    CmnObjJs.ReplaceCls(specChoiceSlctdLnks[specChoiceLnkIdx], "SpecChoiceSlctd", "SpecChoiceVisitedLnk ");
                                }
                                if (inLnSpecDict[inLnSpecId].ValExists(prodAttrId, prodValId, cntxtNm)) {
                                    for (var specChoiceLnkIdx = 0; specChoiceLnkIdx < specChoiceLnks.length; specChoiceLnkIdx++) {
                                        if (prodValId == specChoiceLnks[specChoiceLnkIdx].getAttribute("data-mcm-prod-attrval-id")) {
                                            CmnObjJs.AddCls(specChoiceLnks[specChoiceLnkIdx], "SpecChoiceSlctd");
                                            CmnObjJs.RemCls(specChoiceLnks[specChoiceLnkIdx], "SpecChoiceVisitedLnk");
                                        }
                                    }
                                } else {
                                    for (var specChoiceLnkIdx = 0; specChoiceLnkIdx < specChoiceLnks.length; specChoiceLnkIdx++) {
                                        if (prodValId == specChoiceLnks[specChoiceLnkIdx].getAttribute("data-mcm-prod-attrval-id")) {
                                            CmnObjJs.RemCls(specChoiceSlctdLnks[specChoiceLnkIdx], "SpecChoiceSlctd");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
				
				parentRows = CmnObjJs.GetElementsByClsNm("ItmTblCellPrce", "td", tblRow);
				
				for (var parentRowIdx = 0; parentRowIdx < parentRows.length; parentRowIdx++) {
                    var parentRow = parentRows[parentRowIdx];
                    if (parentRow.getAttribute("data-mcm-prodgrps") == prdGrp) {
                        var prceSlctdLnk = CmnObjJs.GetElementsByClsNm("PrceLnkSlctd", "a", parentRow)[0];
                        var prceLnk = CmnObjJs.GetElementsByClsNm("PrceLnk", "a", parentRow)[0];
                        if (prceLnk) {
							var prodAttrIds = prceLnk.getAttribute("data-mcm-prod-attr-id").split(",")
							var prodValIds = new Array;
                            CmnObjJs.ReplaceCls(prceSlctdLnk, "PrceLnkSlctd", "PrceLnkVisited ");
                            
							for (var i = 0; i < prodAttrIds.length; i++) {
							    var valId = Cmn.Utilities.Keys(inLnSpecDict[inLnSpecId].GetAttrSlctdVals(prodAttrIds[i], cntxtNm))[0]
							    if (valId){
							        prodValIds[i] = valId;
							    }
							}
                            if (prodValIds.join(",") == prceLnk.getAttribute("data-mcm-prod-attrval-id")) {
                                CmnObjJs.AddCls(prceLnk, "PrceLnkSlctd");
                                CmnObjJs.RemCls(prceLnk, "PrceLnkVisited");
                            } else {
                                CmnObjJs.RemCls(prceSlctdLnk, "PrceLnkSlctd");
                            }
                        }
                    }
                }
				
                McMaster.SesnMgr.SetStVal(StValDefs.InLnSpecUsrInps.KyTxt(), inLnSpecDict);
                InLnOrdWebPart.updtSpecAttr(inLnSpecId, inpElem);

            } else if (prodAttrId && prodValId && cntxtNm == "OrdPad") {
                // The visitor is interacting with a normal attribute.  
                // Toggle the filter, save it off to session, and publish a message

                var partNbrCol = Cmn.GetPrevSibling(Cmn.GetAncestorByClsNm(inpElem, "OrdPadProdsWebPartLayout_PartDscCell"));
                var partNbrTxt = Cmn.GetFrstChld(Cmn.GetFrstChldByClsNm(partNbrCol, "OrdPadProdsWebPart_ShowOnPending")).value;
                var lnSeqNbr = getLnSeqFrmLnElem(inpElem);
                var ordPadSpecId = partNbrTxt + "_" + lnSeqNbr;
                if (McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.OrdLnSpecUsrInps.KyTxt()) == null) {
                    var ordLnSpecInpDict = {};
                    ordLnSpecInpDict[ordPadSpecId] = SpecSrchInp.Get().RemAll();
                    McMaster.SesnMgr.SetStVal(StValDefs.OrdLnSpecUsrInps.KyTxt(), ordLnSpecInpDict);
                }
                var ordLnSpecInpDict = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.OrdLnSpecUsrInps.KyTxt());
                if (ordPadSpecId in ordLnSpecInpDict) {
                    ordLnSpecInpDict[ordPadSpecId].ToggleVal(prodAttrId, pubAttrId, prodValId, pubValId, cntxtNm);
                } else {
                    //SpecSrchInp.Get().RemAll().UpdateSession();
                    ordLnSpecInpDict[ordPadSpecId] = SpecSrchInp.Get().RemAll();
                    ordLnSpecInpDict[ordPadSpecId].ToggleVal(prodAttrId, pubAttrId, prodValId, pubValId, cntxtNm);
                }

                McMaster.SesnMgr.SetStVal(StValDefs.OrdLnSpecUsrInps.KyTxt(), ordLnSpecInpDict);
                var MSG_HDR = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.ORD_PAD);
                McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.OrdPadLnSpecSlctd(MSG_HDR, lnSeqNbr, partNbrTxt));

            }


            //Update the input element to reflect the selection or deselection
            toggleChkMark(inpElem);

            //Remember the position of the specification that was selected
            if (maintainScrollPosnInd) {
                SpecSrchWebPart.MaintainFocus.SavePosn(inpElem);
            }
        }
    };

    //------------------------------------------------------------
    // Summary: Creates a message that tracks a deep link click
    //          We pass in the deep link attribute and value that's
    //          was clicked on. 
    //          Then we travel up the dom to find it's container
    //          and grab it's attribute and value.
    //          Then format the tracking message
    //------------------------------------------------------------
    var crteDeepLnkTrkMsg = function(inpElem, trkAttrValNm, trkAttrGrpNm) {
		
        var ancstr = getAttrByInnerElem(inpElem, LANDING_PG_ATTR_CLS_NM);
		var ancstrTrkAttrGrpNm = getClickedValParGrpNm(inpElem, ancstr);   
        var elems = Cmn.GetElementsByClsNm("PrsnttnHdrCntnr","div",ancstr);
        var ancstrTrkAttrGrpVal= Cmn.GetTxtContent(getCaptionLnkByInpElem(elems[0],"LandingPage"));  

        var trkMsg = "&Attribute=" + ancstrTrkAttrGrpNm 
                      + "&Value=" + ancstrTrkAttrGrpVal 
                      + "&Attribute=" + trkAttrGrpNm + "&Value=" + trkAttrValNm.Trim();
        
        return trkMsg;
    };
    
    //------------------------------------------------------------
    // Summary: 
    //------------------------------------------------------------
	var getClickedValParGrpNm = function(inpElem, ancstr) {
		
		var grpNm = "";
		if (inpElem && ancstr){
			var ancstrPubAttrId = getPubAttrIdFrmTxt(ancstr.id);
			grpNm = me.GetAttrNm(ancstrPubAttrId);   
		}
	 	
	 	return grpNm
	 };    
	 
    //------------------------------------------------------------
    // Summary: Processes the act of selecting a value in a dropdown.
    //------------------------------------------------------------
    var procssDropDwnValClick = function (prodAttrId, pubAttrId, prodValId, pubValId, inpElem, cntxtNm) {

        //Get a copy of the spec search input
        var sesnSpecInp = SpecSrchInp.Get();

        //Get the value of the option selected
        var newValTxt = inpElem.innerHTML;
        var ANY_VAL_TXT = "(Any)";

        //Figure out what to update
        if (newValTxt === ANY_VAL_TXT) {
            //The "(Any)" value is selected so clear out the attribute
            sesnSpecInp.RemAttr(prodAttrId, cntxtNm);
        } else if (prodAttrId && sesnSpecInp.ValExists(prodAttrId, prodValId, cntxtNm)) {
            //The visitor is deselecting a value that was already selected
            sesnSpecInp.RemAttr(prodAttrId, cntxtNm);
            newValTxt = ANY_VAL_TXT;
        } else if (prodAttrId && prodValId) {
            //The visitor is changing their selection.  First clear out 
            //all other filters in the attribute, since dropdowns are by 
            //nature single-select attributes, then toggle the value
            sesnSpecInp.RemAttr(prodAttrId, cntxtNm);
            sesnSpecInp.ToggleVal(prodAttrId, pubAttrId, prodValId, pubValId, cntxtNm);
        } else {
            //Do nothing.
        }

        // Update the value displayed in the dropdown menu
        var dropDownMnu = Cmn.GetAncestorBy(inpElem, getInpElemIsDropDwnMenu);
        var dropDownBtn = Cmn.GetPrevSibling(dropDownMnu, getInpElemIsDropDwnMenu);
        dropDownBtn.innerHTML = newValTxt;

        // Update session and publish the spec selected message
        sesnSpecInp.UpdateSession().PubMsg();
    };

    //------------------------------------------------------------
    // Summary: Handles processing of a "clear all" link click.
    // Input:   Validated click(ed) element
    //------------------------------------------------------------
    var procssClearAllLnkClick = function (inpElem, cntxtNm) {

        //Publish Spec Search Clear All Clicked message
        McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.ChooseSpecsClearAllClick(MSG_HDR));

        //reset the load indicator because an action has occurred
        McMaster.SesnMgr.SetStVal(StValDefs.ChooseSpecsLoadFrmSesnInd.KyTxt(), false);

        //Performance timer - Track the start of the click event
		var top = McMasterCom.Nav.GetTopFrame();
        var trkEvnt = new top.PerfTracker.Evnt(top.PerfTracker.EvntNms.SpecIntClrAll, top.PerfTracker.PgCntxtNms.DynCntnt);

        // Set up a round-trip web reports performance tracker.
        SpecInteractions.Webreports_TrkAct(cntxtNm, ACT.CLEAR_ALL, null, null, true, null, null, inpElem);

        //Immediately hide the "clear all" link to provide instant feedback
        Cmn.SetStyle(inpElem, "display", "none");

        //Scroll to the top of the specification search pane
        var specSrchCntnr = Cmn.GetObj("SpecSrch_Inner");
        Cmn.SetVerticalScrollPosn(specSrchCntnr, 0);

        //Close any open specification information presentations.
        SpecSrchWebPart.SpecInfo.Unload();

        // Commented out prior to product page change.      
        //            var loadFrmSesnInd = GetStVal(StValDefs.ChooseSpecsLoadFrmSesnInd.KyTxt());
        //            if (!loadFrmSesnInd) {
        //clear the filters and update session 
        SpecSrchInp.Get().RemAll().UpdateSession();
        //clear dynamic page presentation stats
        McMaster.SesnMgr.RemStVal(StValDefs.DynamicPagePrsnttnStats.KyTxt());
        //publish a "specification selected" message
        McMaster.MsgMgr.PubMsg(new McMaster.MsgMgrMsgs.SpecSlctd(MSG_HDR));
        //            }

        //Web reports tracking
        SpecInteractions.Webreports_TrkTrip(cntxtNm);

        var srchTrkInfo = new SrchTrkr.SrchDat({ usr: SrchTrkr.UsrActTyps.SLCT });
        srchTrkInfo.usr.elemTyp = SrchTrkr.ElemTyps.CLR_ALL_SPECS_LNK;
        srchTrkInfo.usr.srcNm = getSrcNmFrmCntxt(cntxtNm);
        srchTrkInfo.Trk();
    };

    //------------------------------------------------------------
    // Summary: Handles clicks for dropdown buttons.
    // Input:   inpElem  - Validated clicked element
    //------------------------------------------------------------
    var procssDropDwnBtnClick = function (inpElem) {

        // Get the corresponding dropdown menu for the button that was selected
        var dropDownMenu = Cmn.GetNxtSiblingBy(inpElem, getInpElemIsDropDwnMenu);

        // If another dropdown menu is already open, close it
        if (mOpenDropDownMenu && dropDownMenu !== mOpenDropDownMenu) {
            SpecInteractions.ToggleDropDwnMenu(mOpenDropDownMenu);
        }

        // Open the dropdown menu
        SpecInteractions.ToggleDropDwnMenu(dropDownMenu);

        // Handle instances where the menu is scrolled off the screen
        procssDropDwnScrolledOffScreen(inpElem, dropDownMenu);

        // Scroll to the first selected value in the list
        scrollSlctdValsIntoView(dropDownMenu.parentNode);
    };

    //------------------------------------------------------------
    // Summary: Handles instances where a dropdown menu is
    //          scrolled off the bottom of the screen
    // Input:   dropDownBtn, dropDownMenu  - Dropdown button and menu
    //------------------------------------------------------------
    var procssDropDwnScrolledOffScreen = function (dropDownBtn, dropDownMenu) {

        // Reset the dropdown menu
        dropDownMenu.style.top = "";

        // Gather information about the spec search pane
        var cntnr = Cmn.GetObj("SpecSrch_Inner");
        var cntnrHeight = (cntnr.offsetHeight);
        var cntnrScrollPosn = Cmn.GetVerticalScrollPosn(cntnr);

        // Gether information about the dropdown button
        var dropDownBtnTop = Cmn.GetYOffset(dropDownBtn) - Cmn.GetYOffset(cntnr);
        var dropDownBtnHeight = dropDownBtn.offsetHeight;
        var dropDownBtnBottom = dropDownBtnTop + dropDownBtnHeight;

        // Gather information about the position of the dropdown menu
        var dropDownMenuTop = dropDownBtnBottom - 1; // remove one pixel so the borders overlap
        var dropDownMenuHeight = dropDownMenu.offsetHeight;
        var dropDownMenuBottom = dropDownMenuTop + dropDownMenuHeight;
        var relativeMenuBottom = dropDownMenuBottom - cntnrScrollPosn;
        var menuIsOffScreenInd = (relativeMenuBottom > cntnrHeight);

        // Determine the position of the dropdown menu based on whether it's off the screen
        if (menuIsOffScreenInd) {
            // If the dropdown menu is hanging off the screen, shift it up
            dropDownMenu.style.top = (dropDownBtnTop - dropDownMenuHeight + 1) + "px"; // remove one pixel so the borders overlap
        } else {
            // If the dropdown menu is not hanging off the screen, position it below the button
            dropDownMenu.style.top = (dropDownMenuTop) + "px";
        }
    };

    //------------------------------------------------------------
    // Summary: Toggles a dropdown menu's visibiility.
    // Input:   inpElem  - Validated clicked element
    //------------------------------------------------------------
    this.ToggleDropDwnMenu = function (dropDownMenu) {

        if (dropDownMenu) {
            var menuHiddenClsNm = 'SpecSrch_DropDownMenuHidden',
                    menuVisibleClsNm = 'SpecSrch_DropDownMenuVisible';

            // Swap the hidden/visibility classes
            swapClsNms(dropDownMenu, menuHiddenClsNm, menuVisibleClsNm);

            // Update the open dropdown menu
            if (Cmn.HasCls(dropDownMenu, menuVisibleClsNm)) {
                mOpenDropDownMenu = dropDownMenu;
            } else {
                mOpenDropDownMenu = null;
            }
        }
    };

    //------------------------------------------------------------
    // Summary: Processes the hover event to let a visitor know
    //          that an element on the page is interactive.
    // Input:   inpElem  - Validated hover(ed) element
    //          hoverInd - True if the mouse is currently hovering over it
    //------------------------------------------------------------
    var procssHoverEvnt = function (inpElem, cntxtNm, hoverInd) {

        var hoverAction = (hoverInd) ? Cmn.AddCls : Cmn.RemCls;
        var pointerClsNm = "SpecSrch_Pointer";

        // Toggle the pointer
        if (inpElem) {
            hoverAction(inpElem, pointerClsNm);
        }

        // Handle other specific mouseover behaviors
        if (Cmn.HasCls(inpElem, "SpecSrch_Value") || Cmn.HasCls(inpElem, LANDING_PG_ATTR_CLS_NM) || Cmn.HasCls(inpElem, "LandingPage_DeepLnkVal")) {
            // Handle values
            var imgLnk = getImgLnkByInpElem(inpElem, cntxtNm);
            var captionLnk = getCaptionLnkByInpElem(inpElem, cntxtNm);
            //            var deepLnkAttr = getDeepLnkAttrByInpElem(inpElem);
            var compositeRowElems = getCompositeRowElems(inpElem);
            //            var parCaptionLnk = getParLnkWithDeepLnkAttrElem(deepLnkAttr, VAL_SPEC_PAR_ELEM_ID_CD.CAPTION);
            //            var parImgLnk = getParLnkWithDeepLnkAttrElem(deepLnkAttr, VAL_SPEC_PAR_ELEM_ID_CD.IMG);
            //            


            // Handle the image, caption, and other elements (i.e. the "Any" dropdown value)
            var hoverClassNm = "SpecSrch_Value_Hover";
            if (compositeRowElems && compositeRowElems.length > 0) {
                // composite table value
                for (var i = 0; i < compositeRowElems.length; i++) {
                    hoverAction(compositeRowElems[i], hoverClassNm);
                }
            } else {
                if (imgLnk) {
                    if (cntxtNm && cntxtNm.toLowerCase() == "landingpage") {
                        //                        switch (true) {
                        ////                            case (Cmn.HasCls(imgLnk, "SpecSrch_SideBySideImgSpacing")):
                        ////                                hoverAction(imgLnk, "LandingPage_SideBySideImg_Hover");
                        ////                                break;
                        ////                            case (Cmn.HasCls(imgLnk, "SpecSrch_StackedImgSpacing")):
                        ////                                hoverAction(imgLnk, "LandingPage_StackedImg_Hover");
                        ////                                break;
                        ////                            case (Cmn.HasCls(imgLnk, "LandingPage_ComplexStackedImg")):
                        ////                                hoverAction(imgLnk, "LandingPage_ComplexStackedImg_Hover");
                        ////                                break;
                        //                            default:
                        //                                hoverAction(imgLnk, hoverClassNm);
                        //                        }
                    } else {
                        hoverAction(imgLnk, hoverClassNm);
                    }
                }


                if (captionLnk) {
                    if (cntxtNm && cntxtNm.toLowerCase() == "landingpage") {
                        switch (true) {
                            //                            case (Cmn.HasCls(captionLnk, "SpecSrch_SideBySideTxtPadding")):                        
                            //                                hoverAction(captionLnk, "LandingPage_SideBySideTxt_Hover");                        
                            //                                break;                        
                            //                            case (Cmn.HasCls(captionLnk, "LandingPage_StackedTxt")):                        
                            //                                hoverAction(captionLnk, "LandingPage_StackedTxt_Hover");                        
                            //                                break;                        
                            //                            case (Cmn.HasCls(captionLnk, "LandingPage_ComplexStackedTop")):                        
                            //                                hoverAction(captionLnk, "LandingPage_ComplexStackedTop_Hover");                        
                            //                                break;                        
                            //                            case (Cmn.HasCls(captionLnk, "LandingPage_DeepLnkVal")):                        
                            //                                hoverAction(captionLnk, "LandingPage_DeepLnkVal_Hover");                        
                            //                                break;                        
                            case (Cmn.HasCls(inpElem, "LandingPage_NoDeepLnks")):
                                break;
                            default:
                                hoverAction(captionLnk, "LandingPage_Val_Hover");
                        }
                    } else {
                        hoverAction(captionLnk, hoverClassNm);
                    }
                }


                //                if (deepLnkAttr) {
                //                    if (cntxtNm && cntxtNm.toLowerCase() == "landingpage") {
                //                        hoverAction(deepLnkAttr, "LandingPage_DeepLnkAttr_Hover");
                //                    }
                //                }
                //                
                //                if (parCaptionLnk) {
                //                    if (Cmn.HasCls(parCaptionLnk, "LandingPage_ComplexStackedTop")) {
                //                        hoverAction(parCaptionLnk, "LandingPage_ComplexStackedTop_Hover_Border");
                //                    }        
                //                }

                //                if (parImgLnk) {
                //                    if (Cmn.HasCls(parImgLnk, "LandingPage_ComplexStackedImg")) {
                //                        hoverAction(parImgLnk, "LandingPage_ComplexStackedImg_Hover");
                //                    }        
                //                }


                if (imgLnk == null && captionLnk == null && compositeRowElems.length === 0 && inpElem && deepLnkAttr == null && parCaptionLnk == null && parImgLnk == null) {
                    hoverAction(inpElem, hoverClassNm);
                }
            }

        } else if (Cmn.HasCls(inpElem, "SpecSrch_ClearAllLnk")) {
            // Handle the "clear all" link
            hoverAction(inpElem, "SpecSrch_ClearAllLnk_Hover");

        } else if (Cmn.HasCls(inpElem, "SpecSrch_MoreLnk")) {
            // Figure out what action should be applied
            var hoverAction = (hoverInd) ? Cmn.AddCls : Cmn.RemCls;
            var hoverClassNm = "SpecSrch_MoreLnk_Hover";
            hoverAction(inpElem, hoverClassNm);

        } else if (Cmn.HasCls(inpElem, "SpecSrch_GenInfoLnk")) {
            // Handle general info links
            if (hoverInd) {
                if (Cmn.HasCls(inpElem, "SpecSrch_GenInfoLnk_Slctd")) {
                    Cmn.ReplaceCls(inpElem, "SpecSrch_GenInfoLnk_Slctd", "SpecSrch_GenInfoLnk_Hover_Slctd");
                } else {
                    Cmn.AddCls(inpElem, "SpecSrch_GenInfoLnk_Hover");
                }
            } else {
                if (Cmn.HasCls(inpElem, "SpecSrch_GenInfoLnk_Hover_Slctd")) {
                    Cmn.ReplaceCls(inpElem, "SpecSrch_GenInfoLnk_Hover_Slctd", "SpecSrch_GenInfoLnk_Slctd");
                } else {
                    Cmn.RemCls(inpElem, "SpecSrch_GenInfoLnk_Hover");
                }
            }
        } else if (Cmn.HasCls(inpElem, "WebToolsetToolWebPart_TxtTool_Cntnr")) {
            hoverAction(inpElem, "WebToolsetToolWebPart_TxtTool_Cntnr_Hover");
        }
    };

    //------------------------------------------------------------
    // Summary: Toggles the checkmark on a specification
    // Input:   Markup element
    //------------------------------------------------------------
    var toggleChkMark = function (inpElem) {

        var chkMarkElem = getCompositeValChkMarkElem(inpElem)
                           || getImgLnkByInpElem(inpElem)
                           || getCaptionLnkByInpElem(inpElem);

        //Assign a special selected value style for touch devices.
        if (Cmn.IsTouchAware() === true && Cmn.HasCls(inpElem, "SpecSrch_Img") === false) {
            toggleClsNm(chkMarkElem, "Touch_SpecSrch_SlctdVal");
        } else {
            toggleClsNm(chkMarkElem, "SpecSrch_SlctdVal");
        }
    };

    //------------------------------------------------------------
    //------------------------------------------------------------
    // Summary: Toggles the class name on a specification
    // Input:   Markup element
    //------------------------------------------------------------
    var toggleClsNm = function (inpElem, aClsNm) {

        if (Cmn.HasCls(inpElem, aClsNm)) {
            Cmn.RemCls(inpElem, aClsNm);
        } else {
            Cmn.AddCls(inpElem, aClsNm);
        }
    };

    //------------------------------------------------------------
    // Summary: Swaps one class name for another.
    // Input:   Markup element and two CSS class names
    //------------------------------------------------------------
    var swapClsNms = function (inpElem, aClsNm, bClsNm) {
        switch (true) {
            case (Cmn.HasCls(inpElem, aClsNm)):
                Cmn.ReplaceCls(inpElem, aClsNm, bClsNm);
                break;
            case (Cmn.HasCls(inpElem, bClsNm)):
                Cmn.ReplaceCls(inpElem, bClsNm, aClsNm);
                break;
            default:
                //do nothing
        }
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element is a value.
    // Input:   Markup element
    //------------------------------------------------------------
    var getInpElemIsVal = function (inpElem) {
        var rtnInd = false;
        if (Cmn.HasCls(inpElem, "SpecSrch_Value") || Cmn.HasCls(inpElem, LANDING_PG_ATTR_CLS_NM)
         || Cmn.HasCls(inpElem, "LandingPage_DeepLnkVal")) {
			if (Cmn.HasCls(inpElem, "oldStylSpecVal") == false){
				rtnInd = true;
			}
        }
        return rtnInd;
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element is a dropdown button.
    // Input:   Markup element
    //------------------------------------------------------------
    var getInpElemIsDropDwnBtn = function (inpElem) {
        return (Cmn.HasCls(inpElem, "SpecSrch_DropDownBtn"));
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element is a dropdown menu.
    // Input:   Markup element
    //------------------------------------------------------------
    var getInpElemIsDropDwnMenu = function (inpElem) {
        return (Cmn.HasCls(inpElem, 'SpecSrch_DropDownMenu'));
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element is a value in a dropdown menu.
    // Input:   Markup element
    //------------------------------------------------------------
    var getInpElemIsDropDwnVal = function (inpElem) {
        return (!!Cmn.GetAncestorBy(inpElem, getInpElemIsDropDwnMenu));
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element is a specification
    //          information link
    // Input:   Markup element
    //------------------------------------------------------------
    var getInpElemIsSpecInfoLnk = function (inpElem) {
        return (Cmn.HasCls(inpElem, "SpecSrch_GenInfoLnk"));
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element is the 
    //          "Clear All" link
    // Input:   Markup element
    //------------------------------------------------------------
    var getInpElemIsClearAllLnk = function (inpElem) {
        return (Cmn.HasCls(inpElem, "SpecSrch_ClearAllLnk"));
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element is a toggle link,
    //          i.e. "show/hide" link.
    // Input:   Markup element
    //------------------------------------------------------------
    var getInpElemIsToggleLnk = function (inpElem) {
        return (Cmn.HasCls(inpElem, "SpecSrch_MoreLnk"));
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element or an ancestor
    //          is an opt-out link on a landing page.
    // Input:   Markup element
    //------------------------------------------------------------
    var getInpElemIsOptOutLnk = function (inpElem) {
        return (Cmn.HasCls(inpElem, "WebToolsetToolWebPart_TxtTool_Cntnr"));
    };


    //------------------------------------------------------------
    // Summary: Returns true if the given element or an ancestor
    //          is a deep link attribute.
    // Input:   Markup element
    //------------------------------------------------------------
    var getInpElemIsDeepLnkAttrInd = function (inpElem) {
        if (Cmn.HasCls(inpElem, "LandingPage_DeepLnkVal") ||
        Cmn.GetAncestorByClsNm(inpElem, "LandingPage_DeepLnkVal")) {
            return true;
        }
        if (Cmn.HasCls(inpElem, "LandingPage_ComplexStackedDeepLnks")) {
            return true;
        } else if (Cmn.GetAncestorByClsNm(inpElem, "LandingPage_ComplexStackedDeepLnks")) {
            return true;
        } else {
            return false;
        }
    };


    //------------------------------------------------------------
    // Summary: Retreives the deep link attribute element that's identified 
    //          by the given input element.
    // Input:   The input target element
    // Return:  A reference to the link containing that element's deep links.
    //------------------------------------------------------------
    var getDeepLnkAttrByInpElem = function (inpElem) {

        var rtnElem;

        if (Cmn.HasCls(inpElem, "LandingPage_DeepLnkVal")) {
            rtnElem = Cmn.GetAncestorByClsNm(inpElem, "LandingPage_ComplexStackedDeepLnks");
        } else {
            // If a value has deep links, then the input element should have a "rel" attribute that
            // allows us to get the deep link attribute element.
            var relAttribute = inpElem.getAttribute("rel");
            if (relAttribute) {
                var valSpecAttributeTxt = relAttribute.split(":")[1];
                var valSpecProdAttrId = valSpecAttributeTxt.split("_")[0];
                var valSpecPubAttrId = valSpecAttributeTxt.split("_")[1];

                deepLnkAttr = Cmn.GetObj("LP_E_" + valSpecProdAttrId + "_" + valSpecPubAttrId);
                rtnElem = Cmn.GetAncestorByClsNm(deepLnkAttr, "LandingPage_ComplexStackedDeepLnks");
            }
        }

        return rtnElem;
    };


    //------------------------------------------------------------
    // Summary: Retrieves the parent value's caption element 
    // Input:   Markup element
    //------------------------------------------------------------
    var getParLnkWithDeepLnkAttrElem = function (inpElem, parElemIdCode) {

        var rtnElem;

        var deepLnkAttrElem;
        if (Cmn.HasCls(inpElem, "LandingPage_ComplexStackedDeepLnks")) {
            deepLnkAttrElem = inpElem;
        } else {
            deepLnkAttrElem = Cmn.GetAncestorByClsNm(inpElem, "LandingPage_ComplexStackedDeepLnks");
        }

        if (Cmn.HasCls(inpElem, "LandingPage_DeepLnkVal")) {
            deepLnkAttrElem = inpElem;
        } else {
            deepLnkAttrElem = Cmn.GetAncestorByClsNm(inpElem, "LandingPage_DeepLnkVal");
        }


        if (deepLnkAttrElem) {
            // Get the first deep link value. The html for this element will have a rel attribute from which we can
            // get the parent caption link
            var firstDeepLnkValElem = Cmn.GetElementsByClsNm("LandingPage_DeepLnkVal", "div", deepLnkAttrElem)[0];
            if (firstDeepLnkValElem) {
                var relAttribute = firstDeepLnkValElem.getAttribute("rel");

                var parAttributeTxt = relAttribute.split(":")[1];
                var parValTxt = relAttribute.split(":")[3];

                var parProdAttrId = parAttributeTxt.split("_")[0];
                var parPubAttrId = parAttributeTxt.split("_")[1];

                var parProdValId = parValTxt.split("_")[0];
                var parPubValId = parValTxt.split("_")[1];

                parLnk = Cmn.GetObj("LP_E_" + parProdAttrId + "_" + parPubAttrId + "_" + parElemIdCode + "_" + parProdValId + "_" + parPubValId);
                if (parLnk) {
                    rtnElem = getVldClickElem(parLnk) || Cmn.GetAncestorBy(parLnk, getVldClickElem);
                }
            }
        }

        return rtnElem;
    };

    //------------------------------------------------------------  
    // <summary>
    // Get the part number link on which the user clicked based on the 
    // class name passed through. 
    // </summary>
    // <param name="partNbrTxt">The part number text.</param>
    // <param name="clsNm">The class name on the part number link we're seeking.</param>
    // <remarks> The class name indicates whether or not the box has been opened.</remarks>
    //------------------------------------------------------------
    var fndPartNbrLnkByClsNm = function (partNbrTxt, clsNm, seqNbr) {
        var slctdPartNbrIdx;
        
        var CmnObjJs = null;
        if (chkCtlgPageInd()){
            CmnObjJs = McMasterCom.Nav.GetTopFrame().MainIFrame.Catalog.Cmn;
        }else{
            CmnObjJs = Cmn;
        }
        
        var partNbrLnks = CmnObjJs.GetElementsByClsNm(clsNm, "a");

        // Look through part number links and find the one with the 
        // passed in class name and part number text as innerHTML 
        // that is in a table.  We want to ignore 
        // links not in a table, since we can not open our box for them.
        for (var lnkIdx = 0; lnkIdx < partNbrLnks.length; lnkIdx++) {
            if (partNbrLnks[lnkIdx].innerHTML == partNbrTxt &&
                partNbrLnks[lnkIdx].parentNode.tagName == "TD" && 
                seqNbr == partNbrLnks[lnkIdx].getAttribute("data-mcm-partnbr-seqnbr")) {
                slctdPartNbrIdx = lnkIdx;
                break;
            }
        }
        return partNbrLnks[slctdPartNbrIdx];
    }
    //------------------------------------------------------------
    // Summary: Retreives the product version of the attribute id 
    //          from the markup id
    // Input: element's id attribute
    // Return: String of specification's product attribute id
    //------------------------------------------------------------
    var getProdAttrIdFrmTxt = function (elemIdTxt) {
        return elemIdTxt.split('_')[2];
    };

    //------------------------------------------------------------
    // Summary: Retreives the publishing version of the attribute id 
    //          from the markup id
    // Input: element's id attribute
    // Return: String of specification's publishing attribute id
    //------------------------------------------------------------
    var getPubAttrIdFrmTxt = function (elemIdTxt) {
        return elemIdTxt.split('_')[3];
    };

    //------------------------------------------------------------
    // Summary: Retreives the prefix id text from the markup id
    //          of a value in a composite table.
    // Input: element's id attribute
    // Return: Prefix string of specification's attribute id
    //------------------------------------------------------------      
    var getCompositeValIdPrefixTxt = function (elemIdTxt) {
        // Split on delimiter
        var splitTxt = elemIdTxt.split("_");

        // remove the digit suffix
        splitTxt.pop();

        return splitTxt.join("_");
    };

    //------------------------------------------------------------
    // Summary: Retreives the product version of the value id 
    //          from the markup id
    // Input: element's id attribute
    // Return: String of specification's product value id
    //------------------------------------------------------------
    var getProdValIdFrmTxt = function (elemIdTxt) {
        return elemIdTxt.split('_')[5];
    };

    //------------------------------------------------------------
    // Summary: Retreives the publishing version of the value id 
    //          from the markup id
    // Input: element's id attribute
    // Return: String of specification's publishing value id
    //------------------------------------------------------------
    var getPubValIdFrmTxt = function (elemIdTxt) {
        return elemIdTxt.split('_')[6];
    };

    //------------------------------------------------------------
    // Summary: Retreives the type of value from the markup id
    // Input: element's id attribute
    // Return: A short string of the specification's type of data.
    //         This could be things like T(ext), I(mage), or
    //         T(ext)O(nly), etc.
    //------------------------------------------------------------
    var getValTypFrmTxt = function (elemIdTxt) {
        return elemIdTxt.split('_')[4];
    };

    //------------------------------------------------------------
    // Summary: Retreives an attribute given an element inside it.
    // Input:   An element within the attribute
    // Return:  A reference to the attribute containing that element.
    //------------------------------------------------------------
    var getAttrByInnerElem = function (inpElem, clsNm) {
 
        //default to spec search attribute class name   
        if (clsNm == undefined || clsNm.length === 0) {
            clsNm = SPEC_SRCH_ATTR_CLS_NM;   
        }
        
        if (Cmn.HasCls(inpElem, clsNm)) {
            // Return the element itself since it's the attribute
            return inpElem;
        } else {
            // Return the nearest ancestor that's an attribute
            return Cmn.GetAncestorByClsNm(inpElem, clsNm);
        }
    };

    //------------------------------------------------------------
    // Summary: Returns the element that's visible for the given ID.
    // Input:   An element ID
    // Returns: The element with the given ID, or its complementary
    //          element -- whichever one is visible at the time.
    //------------------------------------------------------------          
    getVisibleElemById = function (idTxt) {

        var elemA = Cmn.GetObj(idTxt),
                elemB = getComplementaryElemById(idTxt);

        if (getElemIsVisible(elemA)) {
            return elemA;
        } else if (getElemIsVisible(elemB)) {
            return elemB;
        } else {
            return null;
        }
    };

    //------------------------------------------------------------
    // Summary: Returns true if the given element is visible.
    // Input:   An HTML element
    //------------------------------------------------------------          
    var getElemIsVisible = function (elem) {

        var attr = (elem) ? getAttrByInnerElem(elem,SPEC_SRCH_ATTR_CLS_NM) : null;
        return (attr && Cmn.HasCls(attr, "SpecSrch_AttrShow") && attr.style.display !== "none");
    };

    //------------------------------------------------------------
    // Summary: Returns the html element that complements the
    //          display state of the passed-in attribute container.
    // Input:   Validated click(ed) element
    //------------------------------------------------------------          
    var getComplementaryElemById = function (idTxt) {

        var complementaryIdTxt = "";

        if (idTxt.indexOf("_C_") >= 0) {
            complementaryIdTxt = idTxt.replace("_C_", "_E_");
        } else {
            complementaryIdTxt = idTxt.replace("_E_", "_C_");
        }

        return Cmn.GetObj(complementaryIdTxt);
    };

    //------------------------------------------------------------
    // Summary: Returns the caption for the given image element, or vice versa.
    // Input:   Validated click(ed) element
    //------------------------------------------------------------          
    var getComplementaryImgTxtElemById = function (inpElem) {

        var complementaryIdTxt = "";

        if (inpElem.id.indexOf("_I_") >= 0) {
            complementaryIdTxt = inpElem.id.replace("_I_", "_T_");
        } else {
            complementaryIdTxt = inpElem.id.replace("_T_", "_I_");
        }

        var idEq = function (elem) {
            return elem.id == complementaryIdTxt
        }

        return Cmn.GetElementBy(idEq, null, Cmn.GetAncestorByTagNm(inpElem, "table"));
    };

    //------------------------------------------------------------
    // Summary: Retreives the image link that's identified 
    //          by the given input element.
    // Input:   The input target element
    // Return:  A reference to the link containing that element's image.
    //------------------------------------------------------------
    var getImgLnkByInpElem = function (inpElem, cntxtNm) {
        var imgElem = null;
        if (cntxtNm && cntxtNm.toUpperCase() == "LANDINGPAGE" && inpElem) {
            var imgElems = Cmn.GetElementsByClsNm("ImgsCntnr", "div", inpElem);
            if (imgElems && imgElems.length > 0) {
                imgElem = imgElems[0];
            }

        } else {
            if (inpElem.id.indexOf("_I_") >= 0) {
                // The given element was the image
                imgElem = inpElem;
            } else {
                // Return the image
                imgElem = getComplementaryImgTxtElemById(inpElem);
            }
        }
        return imgElem;
    };

    //------------------------------------------------------------
    // Summary: Retreives the caption link that's identified 
    //          by the given input element.
    // Input:   The input target element
    // Return:  A reference to the link containing that element's caption.
    //------------------------------------------------------------
    var getCaptionLnkByInpElem = function (inpElem, cntxtNm) {
        var captionElem = null;
        if (cntxtNm && cntxtNm.toUpperCase() == "LANDINGPAGE" && inpElem) {
            if (Cmn.HasCls(inpElem, "PrsnttnHdrCntnr")) {
                captionElem = inpElem;
            } else {
                var captionElems = Cmn.GetElementsByClsNm("PrsnttnHdrCntnr", "div", inpElem);
                if (captionElems && captionElems.length > 0) {
                    captionElem = captionElems[0];
                }
            }

        } else {
            if (inpElem.id.indexOf("_T_") >= 0) {
                // The given element is the caption
                captionElem = inpElem;
            } else {
                // Return the caption
                captionElem = getComplementaryImgTxtElemById(inpElem);
            }
        }
        
        return captionElem;
    };
    
    //------------------------------------------------------------
    // <summary>
    // Given an HTMLelement from an order line, determines the sequence
    // number of the order line.
    // </summary>
    // <param name="elemOrId">
    // An HTML element or the ID of an HTML element found within an order
    // line.
    // </param>
    // <returns>
    // The sequence number of the order line that contains the specified
    // element or -1 if no sequence is found.
    // </returns>
    //------------------------------------------------------------
    var getLnSeqFrmLnElem = function (elemOrId) {
        var rtnLnSeq = -1;
        var ordLnRow;

        ordLnRow = Cmn.GetAncestorByClsNm(elemOrId, "OrdPadProdsWebPart_LnRow")

        // This check is here to avoid errors when the calling code passes
        // an element in that actually isn't in an order line row.
        if (ordLnRow && ordLnRow.className) {
            var clsNms = ordLnRow.className.split(" ");

            for (var clsIdx = 0; clsIdx < clsNms.length; clsIdx++) {
                if (mLnSeqRegex.test(clsNms[clsIdx])) {
                    rtnLnSeq = clsNms[clsIdx].match(mNbrRegex)[0];
                    break;
                }
            }
        }

        return rtnLnSeq;
    };
    //------------------------------------------------------------
    // Summary: Retreives the elements associated with a visual
    //          row of values in a composite table (e.g. Overall Size).
    // Input:   The input target element
    // Return:  An array of associated elements.
    //------------------------------------------------------------
    var getCompositeRowElems = function (inpElem) {
        var rtnVal = [];

        if (isCompositeVal(inpElem)) {
            var prefixTxt = getCompositeValIdPrefixTxt(inpElem.id);

            // HACK
            // There's no way at the moment to know how many implicit
            // sibling composite table values are present.  The code
            // below is arbitrary.
            for (var i = 1; i <= 3; i++) {
                var siblingElem = Cmn.GetObj(prefixTxt + "_" + i);
                if (siblingElem) { rtnVal.push(siblingElem); }
            }
        }

        return rtnVal;
    };

    //------------------------------------------------------------
    // Summary: Returns the html element of the value in a composite
    //          that should have a checkmark.
    //          
    // Input:   The input target element
    // Return:  First element in composite table visual row.  If
    //          passed-in value is not a value in a composite table,
    //          returns null;
    //------------------------------------------------------------      
    var getCompositeValChkMarkElem = function (inpElem) {
        var rtnVal = null;

        if (isCompositeVal(inpElem)) {
            var prefixTxt = getCompositeValIdPrefixTxt(inpElem.id);
            var frstElemInRow = Cmn.GetObj(prefixTxt + "_1");
            if (frstElemInRow) { rtnVal = frstElemInRow; }
        }

        return rtnVal;
    };

    //------------------------------------------------------------
    // Summary: Retreives true if the passed-in value is part of a
    //          composite table.
    // Input:   The input target element
    // Return:  An array of associated elements.
    //------------------------------------------------------------      
    var isCompositeVal = function (inpElem) {
        return (inpElem.id.indexOf("compositevalue") >= 0);
    };

    //-------------------------------------------------------------------------
    // <summary>
    // Check catalog page or dynamic page
    // </summary>
    //-------------------------------------------------------------------------
    var chkCtlgPageInd = function(){
        var ctlgPageInd = false;
        var prodPageObj = Cmn.GetObj("ProdPageContent");
        if (prodPageObj) {
            //we are in dynamic page
        }else{
            ctlgPageInd = true;
        }
        return ctlgPageInd;
    }
	
	//-------------------------------------------------------------------------
    // <summary>
    // Determine the web part that the customer interacted with
    // </summary>
    //-------------------------------------------------------------------------
	var getSrcNmFrmCntxt = function(cntxtNm) {
	
		var srcNm = "";
	
		if (cntxtNm === CNTXT.LANDING_PAGE) {
			srcNm = "LandingPageWebPart";
		} else if (cntxtNm === CNTXT.CHOOSE_SPECS) {
			srcNm = "SpecSrchWebPart";
		} else if (cntxtNm === CNTXT.IN_LN_ORD) {
		    srcNm = "InLnOrdWebPart";
		} else {
			srcNm = "SpecInteractions";
		}
		
		return srcNm;
		
	};
	
	
	// <summary>Sets cursor to specified position within text elem. </summary>
	// <param name="elem">Input e.g. textarea</param>
	// <param name="posn">Zero based index in elem's current value. </param>
	var setCursorPosn = function(elem, posn){
		if(elem.setSelectionRange) {
			elem.focus();
			elem.setSelectionRange(posn,posn);
		} else if (elem.createTextRange) {
			var range = elem.createTextRange();
			range.collapse(true);
			range.moveEnd('character', posn);
			range.moveStart('character', posn);
			range.select();
		}
	}
	
	
	
	// <summary>Counts occurrences of substring.</summary>
	// <param name="find">The substring to search for.</param>
	// <param name="str">The text to be searched through.
	// Does not alter original str.</param>
	// <param name="until"> Non-inclusive char index to stop searching at. </param>
	// <returns>Count.</returns>
	var countAllSubstr = function(find,str,until){
		until = until || str.length;
		var start = 0;
		var count = 0;
		while(str.indexOf(find,start) >= 0){
			start = str.indexOf(find,start) + 1;
			if (start - 1 < until){
				count ++;
			}
		}
		return count;
	}
			
	// <summary>Gets character code from most recent key event.</summary>
	// <param name="keycd">event.keyCode</param>
	// <param name="chcd">event.charCode</param>
	// <param name="wch">event.which</param>
	// <returns>ASCII code for most recent key event.</returns>
	var getKey = function(kycd,chcd,wch){
		if (wch == null){
			return kycd;
		} else if (wch != 0 && chcd != 0){
			return wch;
		} else {
			return 0;
		}
	}
	
	// <summary>Checks that text fits within line restrictions.
	// A line is defined by the newline character only. </summary>
	// <param name="text">Text to verify.</param>
	// <param name="lnLmt">Maximum lines.</param>
	// <returns>True if text conforms to restrictions.</returns>
	var verifyDimensions = function(txt,lnLmt){
		// lnLmt is default to 0 if unlimited.
		return lnLmt ? txt.split("\n").length <= lnLmt : true;
	}
	
	// <summary>Explicitly enters a printable keystroke into a text field.</summary>
	// <param name="key">ASCII code of the key event.</param>
	// <param name="sel"> Object containing left and right indexes of selected text. </param>
	// <param name="txt">Original text to operate on. Does not modify original.</param>
	var applyPrintableChar = function(key,sel,txt){
		//valid for printable unicode characters
		leftCursorPosn = sel.start;
		rightCursorPosn = sel.end;
		var preTxt = txt.substring(0,leftCursorPosn);
		var postTxt = txt.substring(rightCursorPosn);
		if (key == UNICODE_CARRIAGE_RETURN) {
			// change carriage return to newline
			key = UNICODE_LINE_FEED;
		}
		// Move cursor outside of a soft break to keep it invisible to users.
		// This is not as strict as it could be, but it doens't need to be strict.
		if (leftCursorPosn > 0 && txt[leftCursorPosn] === "\n" && txt[leftCursorPosn-1] === ZERO_WIDTH_SPACE){
			preTxt = preTxt.slice(0,-1);
			sel.start --;
		}
		if (rightCursorPosn > 0 && txt[rightCursorPosn] === "\n" && txt[rightCursorPosn-1] === ZERO_WIDTH_SPACE){
			postTxt = ZERO_WIDTH_SPACE + postTxt;
			//for symmetry we should also shift sel.end here but we don't because it's never referenced again
		}
		sel.start ++;
		return preTxt + String.fromCharCode(key) + postTxt;
	}
	
	// <summary>Explicitly enters a printable keystroke into a text field.</summary>
	// <param name="key">ASCII code of the key event.</param>
	// <param name="sel"> Object containing left and right indexes of selected text. </param>
	// <param name="txt">Original text to operate on. Does not modify original.</param>
	// <returns>Text with characters deleted from proper locations.</returns>
	var applyDeletion = function(key, sel, txt){
		var leftCursorPosn = sel.start;
		var rightCursorPosn = sel.end;
		if (key == UNICODE_BACKSPACE){
			// backspace
			if (leftCursorPosn == rightCursorPosn) {
				var preTxt = txt.substring(0,leftCursorPosn-1);
				var postTxt = txt.substring(rightCursorPosn);
				sel.start --;
				// If backspacing a soft wrap, cleans up ZWS as well.
				// Makes our implementation of soft wrapping invisible to users.
				if (leftCursorPosn > 1 &&
					txt[leftCursorPosn-1] === "\n" && txt[leftCursorPosn-2] === ZERO_WIDTH_SPACE){
					preTxt = preTxt.slice(0,-1);
					sel.start --;
					// If deleting a soft wrap between words, deletes space between words.
					if (leftCursorPosn > 2 && 
						(txt[leftCursorPosn-3] === ZERO_WIDTH_SPACE || txt[leftCursorPosn-3] === " ")){
						preTxt = preTxt.slice(0,-1);
						sel.start --;
					}
				// Or if you're backspacing a ZWS inside a softwrap, delete the visible part (the previous char).
				} else if (leftCursorPosn > 1 &&
					txt[leftCursorPosn] === "\n" && txt[leftCursorPosn-1] === ZERO_WIDTH_SPACE){
					preTxt = preTxt.slice(0,-1);
					sel.start --;
					postTxt = postTxt.substring(1);
				}
			} else {
				var preTxt = txt.substring(0,leftCursorPosn);
				var postTxt = txt.substring(rightCursorPosn);
			}
			return preTxt + postTxt;
			
		} else if (key == UNICODE_DELETE){
			// delete 
			if (leftCursorPosn == rightCursorPosn){ 
				var preTxt = txt.substring(0,leftCursorPosn);
				var postTxt = txt.substring(leftCursorPosn+1);
			} else {
				var preTxt = txt.substring(0,leftCursorPosn);
				var postTxt = txt.substring(rightCursorPosn);
			}
			// If ZERO_WIDTH_SPACE<cursor>\n don't delete the ZWS. It effectively adds a space
			// to the end of the line if there's room and then repeated deletes don't do anything. Maybe the
			// expected behavior would be to delete the first char on the next line in addition to the \n but
			// I don't think it's worthwhile to worry about right now.
			return preTxt + postTxt;
		}
	}
	
	// <summary>Splits line into words, treating spaces as words also.</summary>
	// <param name="line">A string of characters containing no linebreaks.</param>
	// <returns>An array of each word and -space- in lines.</returns>
	var splitLineIntoWords = function(line){
		var charIdx = 0;
		var words = [];
		var word = "";
		while (charIdx < line.length){
			if (line[charIdx] != " "){
				//add each char to current word
				word += line[charIdx];
			} else {
				//We've reached a -space-:
				//Push current word onto array, reset
				//current word, push -space- onto array.
				words.push(word);
				word = "";
				words.push(line[charIdx]);
			}
			charIdx ++;
		}
		words.push(word);
		return words;
	}
	
	// <summary>Creates object holding the indexes of the beginning 
	// and end of a text selection. The .start field holds the lower index.
	// The .end field holds the upper index. </summary>
	// <param name="box"> The editable content that the selection was made in. </param>
	var getSelection = function(box){
		var sel = {start: box.selectionStart, end: box.selectionEnd};
		if (sel.start > sel.end) {
			var tmp = sel.start;
			sel.start = sel.end;
			sel.end = tmp;
		}
		return sel;
	}
	
	// <summary>Find and replace all.</summary>
	// <param name="find">The substring to search for.</param>
	// <param name="rplc">The replacement substring.</param>
	// <param name="str">The text to be searched through. 
	// Does not alter original str.</param>
	// <returns>String with all replacements made.</returns>
	var replaceAllSubstr = function(find,rplc,str){
		var rplcd = str.replace(find,rplc);
		while(rplcd != rplcd.replace(find,rplc)){
			rplcd = rplcd.replace(find,rplc);
		}
		return rplcd;
	}
	
	// <summary>Wraps text optimally from top to bottom, honoring user provided whitespace.</summary>
	// <param name="txt">Text to be wrapped. Original text is not modified.</param>
	// <param name="colLmt">Maximum characters per line.</param>
	// <returns>Our implementation of wrapped text.</returns>
	var wrapAlgthm = function(txt, colLmt){
		//If column limit is specified, we do the wrapping. Otherwise let the browser handle it.
		//make 0 constant
		if (colLmt > 0){
			// remove 'soft breaks' 
			var softBreak = ZERO_WIDTH_SPACE + "\n";
			
			txt = replaceAllSubstr(softBreak,"",txt);
			
			// convert hidden real spaces at beginning/end of lines back to visible spaces
			txt = replaceAllSubstr(ZERO_WIDTH_SPACE," ",txt);
			
			// split into lines to honor 'hard breaks'
			var lines = txt.split("\n");
			var newFrmt = [];
			for (var i = 0; i < lines.length; i ++){
				var bldLn = "";
				var spaceRem = colLmt;
				
				// split line into words. treat -space- as a word
				var words = splitLineIntoWords(lines[i]);
				
				// handles the actual wrapping
				for (var j = 0; j < words.length; j ++){
					if(words[j] == " ") {
						// add a space if it's not the first char
						if (spaceRem < colLmt && spaceRem >= 1) {
							bldLn += words[j];
						}
						// if -space- added at end of line, treat as soft break
						if (spaceRem == 0){
							bldLn += ZERO_WIDTH_SPACE;
							// add duplicate zwsp to tag it as a real -space-
							bldLn += ZERO_WIDTH_SPACE;
							newFrmt.push(bldLn);
							bldLn = "";
						}
						
					} else {
						if (words[j].length <= spaceRem){
							//fits on the line
							bldLn += words[j];
						} else if (words[j].length > spaceRem && words[j].length <= colLmt) {
							//wrap whole word to next line
							bldLn += ZERO_WIDTH_SPACE;
							newFrmt.push(bldLn);
							bldLn = words[j];
						} else {
							var reallyBigWord = words[j];
							while (reallyBigWord.length > colLmt){
								//word longer than line. 
								//fit what you can on current line, wrap the rest.
								bldLn += reallyBigWord.substring(0,spaceRem) + ZERO_WIDTH_SPACE;
								newFrmt.push(bldLn);
								reallyBigWord = reallyBigWord.substring(spaceRem);
								bldLn = "";
								spaceRem = colLmt - bldLn.length;
							}
							bldLn = reallyBigWord;
						} 
					}
					spaceRem = colLmt - bldLn.length;
				}
				newFrmt.push(bldLn);
			}
			return newFrmt.join("\n");
		} else {
			return txt;
		}
	}
	
	
};
}

this.SpecSrchWebPart||(SpecSrchWebPart=new function(){this.FromIntermediateLandingPageInd=!1;var g=McMaster.SesnMgr.GetStVal,r=McMaster.SesnMgr.SetStVal,f=McMaster.SesnMgr.StValDefs,l=McMaster.MsgMgr.CntxtNms.CHOOSE_SPECS;McMaster.MsgMgr.AddSubscriber(McMaster.MsgMgrMsgs.ChooseSpecsStatChg,function(a){SpecSrchWebPart.Stat_Chg(a)});McMaster.MsgMgr.AddSubscriber(McMaster.MsgMgrMsgs.SpecToggleLnkSlctd,function(){m()});this.WebPart_LoadCmpl=function(a){var b=McMasterCom.Nav.GetTopFrame();new b.PerfTracker.Evnt(b.PerfTracker.EvntNms.SpecSrchLdCmplBgn,
b.PerfTracker.PgCntxtNms.DynCntnt);if(0<a.UpdtedSpecUsrInp.PreSlctdAttrIds.length&&a.ParWebPart){var c,b={};for(i=0;i<a.UpdtedSpecUsrInp.SpecSrchAttrInps.length;i++)if(c=a.AttrIdToNmDict[a.UpdtedSpecUsrInp.SpecSrchAttrInps[i].SlctdVals[0].PubAttrId])b[c]=a.UpdtedSpecUsrInp.SpecSrchAttrInps[i].SlctdVals[0].PubValId;c=b=p(a,b);var b="",d;for(d in c)b+="&Attribute="+d+"&Value="+c[d].Trim();d=g(f.PreSlctdSpecCntxtNm.KyTxt());""===d&&(d=McMaster.MsgMgr.CntxtNms.SRCH_ENTRY_WEB_PART);0<b.length&&SpecInteractions.Webreports_TrkCustomAct(d,
"Selected Spec",b);r(f.PreSlctdSpecCntxtNm.KyTxt(),"");d=[];for(var b=[],e=c=0;e<a.UpdtedSpecUsrInp.SpecSrchAttrInps.length;e++){var q=a.UpdtedSpecUsrInp.SpecSrchAttrInps[e].ProdAttrId;if(q)for(var n=a.AttrIdToNmDict[a.UpdtedSpecUsrInp.SpecSrchAttrInps[e].SlctdVals[0].PubAttrId],h={},k=0;k<a.UpdtedSpecUsrInp.SpecSrchAttrInps[e].SlctdVals.length;k++)b[c]={attrID:q,valID:a.UpdtedSpecUsrInp.SpecSrchAttrInps[e].SlctdVals[k].ProdValId},h[n]=a.UpdtedSpecUsrInp.SpecSrchAttrInps[e].SlctdVals[k].PubValId,
h=p(a,h),d[c]={attr:n,val:h[n]},c+=1}c=new SrchTrkr.SrchDat({resp:SrchTrkr.RespTyps.SPEC_MTCH});c.resp.srcNm="SpecSrchWebPart";c.resp.mtchdSpec=d?!1==d?null:d:null;c.resp.mtchdSpecIDs=b?!1==b?null:b:null;c.Trk()}a.DisplInd?Cmn.Utilities.NotEmpty(a.AttrIdToNmDict)&&(SpecSrchWebPartLoader.Show(),g(f.ProdPageReloadingInd.KyTxt())&&(SpecInteractions.AddAttrIdToNmDefs(a),SpecInteractions.AttachEvntListeners(a,l,SpecSrchWebPartLoader,!0)),SpecSrchWebPart.MaintainFocus.UpdtPosn(),m()):SpecSrchWebPartLoader.Hide();
SpecSrchInp.Get().SyncWithServerUsrInp(a.UpdtedSpecUsrInp).UpdateSession();!0===a.InvalidatedLastExplicitlyExpandedAttrInd&&SpecSrchInp.Get().RemExplicitlyExpandedAttr().UpdateSession();SpecSrchInp.Get().RemAllProdFilters().UpdateSession();SpecSrchWebPart.SpecInfo.ApplyOpenSpecInfoLnkHighlighting();g(f.ChooseSpecsLoadFrmSesnInd.KyTxt())||ContentHistMgr.Take_Snapshot(ContentHistMgr.TYP.CHOOSE_SPECS_LOAD);b=McMasterCom.Nav.GetTopFrame();new b.PerfTracker.Evnt(b.PerfTracker.EvntNms.SpecSrchLdCmplEnd,
b.PerfTracker.PgCntxtNms.DynCntnt);McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.ProdPageReloadingInd.KyTxt());this.planningtimestamp=new Date;McMaster.MsgMgr.AddSubscriber(McMaster.MsgMgrMsgs.FetchAheadDatRcvd,SpecSrchWebPartLoader.HndlFetchAheadDatRcvd)};this.WebPart_PreUnload=function(a){McMaster.MsgMgr.RemSubscriber(McMaster.MsgMgrMsgs.FetchAheadDatRcvd,SpecSrchWebPartLoader.HndlFetchAheadDatRcvd);g(f.ProdPageReloadingInd.KyTxt())&&(SpecSrchWebPart.SpecInfo.Unload(),SpecSrchWebPartLoader.Hide(),
SpecInteractions.RemoveEvntListeners(a))};this.WebPart_Unload=function(a){g(f.ProdPageReloadingInd.KyTxt())&&SpecSrchWebPartLoader.AbortStaleReq()};var m=function(a){var b=Cmn.GetElementsByClsNm("SpecSrch_Title","DIV",document.getElementById("SpecSrch_Cntnr"))[0],c=Cmn.GetElementsByClsNm("SpecSrch_AttrSeparator"),d=0,d=1<c.length?Cmn.GetWidth(c[1]):Cmn.GetWidth(Cmn.GetElementsByClsNm("SpecSrch_Pane")[0])-10;Cmn.SetStyle(b,"width",d+"px");a||setTimeout(function(){m(!0)},50)};this.Stat_Chg=function(a){if(!a.MsgPayload().ChooseSpecsAutoStatChgInd){var b=
g(f.SlctdSrchRsltTxt.KyTxt());"EXPANDED"==a.MsgPayload().ChooseSpecsSt?Cmn.TrkAct("Action=Opened&SrchTxt="+b,l):"COLLAPSED"==a.MsgPayload().ChooseSpecsSt&&Cmn.TrkAct("Action=Closed&SrchTxt="+b,l)}};var p=function(a,b){var c=document.createElement("div");c.innerHTML=a.ParWebPart.MarkupTxt;var c=Cmn.GetElementsByClsNm("SpecSrch_SlctdVal","td",c),d;for(d in b)for(i=0;i<c.length;i++)if(0<=c[i].id.indexOf(b[d])){var e="",e=0<=c[i].id.indexOf("_C_")&&0<=c[i].id.indexOf("_I_")?Cmn.GetTxtContent(SpecInteractions.GetComplementaryImgTxtElemById(c[i])):
Cmn.GetTxtContent(c[i]);b[d]=e}return b}});


(function(){if(!SpecSrchWebPart.SpecInfo){var r=Cmn.Utilities,w=Cmn.forEach,m=r.Values,y=r.Keys,z=Cmn.map,A=Cmn.filter;SpecSrchWebPart.SpecInfo=function(){this.mGenInfoLnkId=this.mPrsnttnId=null;this.mOpen=!1;return this};SpecSrchWebPart.SpecInfo.mInfos={};SpecSrchWebPart.SpecInfo.mInfosByAttr={};SpecSrchWebPart.SpecInfo.mOpenInfos={};SpecSrchWebPart.SpecInfo.Constants={OUTER_PREFIX:"SpecInfoOuter_",ID_PREFIX:"SpecInfoPadding_"};SpecSrchWebPart.SpecInfo.Create=function(a,b){var d=new SpecSrchWebPart.SpecInfo;
d.mOpen=!1;d.mPrsnttnId=a;d.mGenInfoLnkId=b;return d};SpecSrchWebPart.SpecInfo.Get=function(a){var b;b=a.id.split("_");b=b[b.length-1];var d=SpecSrchWebPart.SpecInfo.mInfos[b],c;d?(c=d.RootAttrGrp(),c||(d=SpecSrchWebPart.SpecInfo.Create(b,a.id),SpecSrchWebPart.SpecInfo.mInfos[b]=d,c=d.RootAttrGrp())):(d=SpecSrchWebPart.SpecInfo.Create(b,a.id),SpecSrchWebPart.SpecInfo.mInfos[b]=d,c=d.RootAttrGrp());return SpecSrchWebPart.SpecInfo.mInfosByAttr[c.id]=d};SpecSrchWebPart.SpecInfo.GetOpenInfos=function(){return SpecSrchWebPart.SpecInfo.mOpenInfos};
SpecSrchWebPart.SpecInfo.ApplyOpenSpecInfoLnkHighlighting=function(){var a=SpecSrchWebPart.SpecInfo.GetOpenInfos();w(m(a),function(a){t(a.LinkElem())})};SpecSrchWebPart.SpecInfo.Unload=function(){SpecSrchWebPart.SpecInfo.CloseAll();SpecSrchWebPart.SpecInfo.mInfosByAttr={};SpecSrchWebPart.SpecInfo.mInfos={}};SpecSrchWebPart.SpecInfo.Click=function(a,b){var d=SpecSrchWebPart.SpecInfo.Get(a);if(d.IsOpen())n(d),SpecSrchWebPart.SpecInfo.TrkAct("Closed general information presentation",d,"Clicked GenInfo Link");
else{var c=McMasterCom.Nav.GetTopFrame();new c.PerfTracker.Evnt(c.PerfTracker.EvntNms.SpecInfoPrsnttnClick,c.PerfTracker.PgCntxtNms.DynCntnt);SpecSrchWebPart.SpecInfo.LoadSpecInfo(d,null,b);SpecSrchWebPart.SpecInfo.TrkAct("Opened general information presentation",d,"Clicked GenInfo Link")}};SpecSrchWebPart.SpecInfo.GetOpenSpecInfoByAttrElem=function(a){var b,d=Cmn.GetElementsByClsNm("SpecSrch_GenInfoLnk","a",a)[0];d||(a=SpecInteractions.GetComplementaryElemById(a.id),d=Cmn.GetElementsByClsNm("SpecSrch_GenInfoLnk",
"a",a)[0]);d&&(b=d.id.split("_")[4],b=SpecSrchWebPart.SpecInfo.GetOpenInfos()[b]);return b};SpecSrchWebPart.SpecInfo.LoadSpecInfo=function(a,b,d){var c=a.Id(),e=B(a,d),f=SpecSrchWebPart.SpecInfo.Constants.OUTER_PREFIX+c,g=SpecSrchWebPart.SpecInfo.Constants.ID_PREFIX+c,n="InvisibleShield_"+c,m="TransparentBorder_"+c;Cmn.GetObj(f);var p=Cmn.GetObj(g);p||(p=Cmn.CrteElement("div"),p.innerHTML='<div class="SpecLayout_GenInfo_InvisibleShield" id="'+n+'"></div><div class="SpecLayout_GenInfo_TransparentBorder" id="'+
m+'"></div><div class="SpecLayout_GenInfo" id="'+f+'"><div class="SpecLayout_GenInfo_Padding" id="'+g+'"></div></div>',Cmn.InsrtAfter(p,Cmn.GetObj("ShellLayout_MainContent_Inner")),Cmn.GetObj(f),p=Cmn.GetObj(g));var s=b||C(a),f=a.mGenInfoLnkId.split("_")[2];PrsnttnWebPartLoader.LoadSpecInfo(c,"full",function(){a.mOpen=!1;var c=b||Cmn.GetWidth(a.Elem());if(c<=s){if(a&&a.IsClosed()){SpecSrchWebPart.SpecInfo.mOpenInfos[a.Id()]=a;a.mOpen=!0;t(a.LinkElem());var e=SpecInteractions.GetComplementaryElemById(a.LinkElem().id);
e&&t(e);var q=void 0,l=a.RootAttrGrp(),f=a.Elem(),e=a.Container(),g=a.InvisibleShield(),n=a.TransparentBorder(),k=a.PaddingContainer(),m=Cmn.GetObj("ProdPageContent"),h=Cmn.GetObj("ShellLayout_ChooseSpecs_Toggle");Cmn.GetX(h);Cmn.GetHeight(Cmn.GetObj("ShellLayout_Header_Cntnr"));if(h=a.HeaderElem())Cmn.SetStyle(h,"width",c-10+"px"),h.nextSibling?Cmn.SetStyle(h.nextSibling,"padding-top","30px"):Cmn.SetStyle(h.parentNode,"padding-bottom","30px");Cmn.GetWidth(f)>c&&(Cmn.SetStyle(k,"width",c+"px"),f=
Cmn.GetHeight(e)+18,Cmn.SetStyle(k,"height",f+"px"),Cmn.SetStyle(k,"overflow-x","scroll"));q=q||Cmn.GetHeight(e);f=q+16;q=Cmn.GetHeight(m);h=q-77;Cmn.GetHeight(k);f>h?(f=h,Cmn.SetStyle(k,"height",f-16-2+"px"),Cmn.SetStyle(k,"width",c+18+"px"),Cmn.SetStyle(k,"overflow-y","scroll")):Cmn.SetStyle(k,"overflow-y","hidden");var c=Cmn.GetObj("SpecSrch_Inner"),k=c.scrollTop,p=c.offsetHeight,r=p-19,h=l.offsetTop,l=Cmn.GetNxtSibling(l),u=0,u=l?l.offsetTop-h+3:c.scrollHeight-h;u<=r&&(l=h+u,p=k+p,h<k+19?Cmn.SetVerticalScrollPosn(c,
h-19):l>p&&Cmn.SetVerticalScrollPosn(c,k+(l-p)));l=Cmn.GetX(Cmn.GetObj("ProdPageContent"));c=Cmn.GetY(Cmn.GetObj("ShellLayout_MainContent_Inner"));c=Cmn.GetY(a.LinkElem())+Cmn.GetHeight(a.LinkElem())-c;k=Cmn.GetHeight(a.HeaderElem())+7+1+1;c-=k;q=47>c?47:c+f>q-30?q-f-30:c;Cmn.SetStyle(g,"top","0px");Cmn.SetStyle(g,"left",l+"px");Cmn.SetStyle(g,"width",Cmn.GetWidth(m)-18+"px");Cmn.SetStyle(g,"height",Cmn.GetHeight(m)+"px");Cmn.SetStyle(n,"left",l+"px");Cmn.SetStyle(n,"top",q+"px");g=Cmn.GetHeight(e)+
14;n=Cmn.GetWidth(e)+14;Cmn.SetStyle(a.TransparentBorder(),"height",g+"px");Cmn.SetStyle(a.TransparentBorder(),"width",n+"px");Cmn.SetStyle(e,"left",l+8+"px");Cmn.SetStyle(e,"top",q+8+"px")}}else c<=v()?SpecSrchWebPart.SpecInfo.LoadSpecInfo(a,c,d):SpecSrchWebPart.SpecInfo.LoadSpecInfo(a,v(),d)},e,s,f)};SpecSrchWebPart.SpecInfo.ClickHandler=function(a){var b=Cmn.GetEvntTarget(a),d=g(b,"SpecLayout_GenInfo"),c=g(b,"SpecSrch_Attribute"),e=g(b,"SpecSrch_MoreLnk"),f=g(b,"SpecLayout_GenInfo_InvisibleShield"),
m=s(b,"ShellLayout_ChooseSpecs_Toggle"),r=s(b,"ShellLayout_SecondaryContentToggle_Cntnr"),t=s(b,"ChooseSpecsClearAll");d?(c=g(b,"SecondaryLnk"),e=SpecSrchWebPart.SpecInfo.Get(d),c?(n(e),SpecSrchWebPart.SpecInfo.TrkAct("Closed general information presentation",e,"Clicked Toggle Button")):"A"==b.tagName.toUpperCase()&&FullPrsnttnWebPart.HndlClickEvnt(a,d.id)):e||(c?SpecInteractions.GetAttrId(c)===SpecSrchInp.Get().UsrInps().LastExplicitlyExpandedAttr?SpecSrchWebPart.SpecInfo.CloseAllExcept(c):SpecSrchWebPart.SpecInfo.CloseAll():
(f||m||r||t)&&SpecSrchWebPart.SpecInfo.CloseAll())};SpecSrchWebPart.SpecInfo.CloseAll=function(a){a=a||m(SpecSrchWebPart.SpecInfo.mOpenInfos);w(m(a),function(a){a.IsOpen()&&(n(a),SpecSrchWebPart.SpecInfo.TrkAct("Closed general information presentation",a,"Clicked Outside of the Presentation"))})};SpecSrchWebPart.SpecInfo.CloseAllExcept=function(a){var b=SpecSrchWebPart.SpecInfo.GetOpenSpecInfoByAttrElem(a);a=SpecSrchWebPart.SpecInfo.GetOpenInfos();b&&(a=z(A(y(a),function(a){return a!=b.Id()}),function(a){return openInfos[a]}));
SpecSrchWebPart.SpecInfo.CloseAll(a)};SpecSrchWebPart.SpecInfo.CloseByAttr=function(a){n(SpecSrchWebPart.SpecInfo.mInfosByAttr[a])};SpecSrchWebPart.SpecInfo.TrkAct=function(a,b,d){var c=McMaster.SesnMgr.GetStVal,e=c(McMaster.SesnMgr.StValDefs.SlctdSrchRsltTxt.KyTxt()),c=b.LinkElem().text;b=SpecInteractions.GetAttrNm(b.TopLvlAttrId());a="Action="+encodeURIComponent(a)+"&SrchTxt="+encodeURIComponent(e);a=a+"&Attribute="+encodeURIComponent(b);a=a+"&GenInfoLinkName="+encodeURIComponent(c);a=a+"&Method="+
encodeURIComponent(d);Cmn.TrkAct(a,"ChooseSpec")};SpecSrchWebPart.SpecInfo.prototype.LinkElem=function(){var a=SpecInteractions.GetVisibleElemById(this.GenInfoLnkId());return a?a:Cmn.GetObj(this.GenInfoLnkId())};SpecSrchWebPart.SpecInfo.prototype.AttrIds=function(){return this.LinkElem().rel.split("|")[0].split(",")};SpecSrchWebPart.SpecInfo.prototype.ProdAttrIds=function(){return this.LinkElem().rel.split("|")[1].split(",")};SpecSrchWebPart.SpecInfo.prototype.TopLvlAttrId=function(){var a=this.AttrIds();
return a&&0<a.length?a[0]:null};SpecSrchWebPart.SpecInfo.prototype.TopLvlProdAttrId=function(){var a=this.ProdAttrIds();return a&&0<a.length?a[0]:null};SpecSrchWebPart.SpecInfo.prototype.HeaderElem=function(){return this.Elem()?this.Elem().firstChild.firstChild:null};SpecSrchWebPart.SpecInfo.prototype.Elem=function(){return Cmn.GetObj(this.ElemId())};SpecSrchWebPart.SpecInfo.prototype.ElemId=function(){return"Full_"+this.Id()};SpecSrchWebPart.SpecInfo.prototype.Container=function(){return Cmn.GetObj(SpecSrchWebPart.SpecInfo.Constants.OUTER_PREFIX+
this.Id())};SpecSrchWebPart.SpecInfo.prototype.InvisibleShield=function(){return Cmn.GetObj("InvisibleShield_"+this.Id())};SpecSrchWebPart.SpecInfo.prototype.TransparentBorder=function(){return Cmn.GetObj("TransparentBorder_"+this.Id())};SpecSrchWebPart.SpecInfo.prototype.PaddingContainer=function(){return Cmn.GetObj(SpecSrchWebPart.SpecInfo.Constants.ID_PREFIX+this.Id())};SpecSrchWebPart.SpecInfo.prototype.Id=function(){return this.mPrsnttnId};SpecSrchWebPart.SpecInfo.prototype.GenInfoLnkId=function(){return this.mGenInfoLnkId};
SpecSrchWebPart.SpecInfo.prototype.RootAttrGrp=function(){var a=Cmn.GetAncestorByClsNm(this.LinkElem(),"SpecSrch_Attribute");return Cmn.GetAncestorByClsNm(a,"SpecSrch_Attribute")||a};SpecSrchWebPart.SpecInfo.prototype.IsOpen=function(){return this.mOpen};SpecSrchWebPart.SpecInfo.prototype.IsClosed=function(){return!this.IsOpen()};var t=function(a){Cmn.HasCls(a,"SpecSrch_GenInfoLnk_Hover")?Cmn.ReplaceCls(a,"SpecSrch_GenInfoLnk_Hover","SpecSrch_GenInfoLnk_Hover_Slctd"):Cmn.AddCls(a,"SpecSrch_GenInfoLnk_Slctd")},
x=function(a){Cmn.HasCls(a,"SpecSrch_GenInfoLnk_Hover_Slctd")?Cmn.ReplaceCls(a,"SpecSrch_GenInfoLnk_Hover_Slctd","SpecSrch_GenInfoLnk_Hover"):Cmn.RemCls(a,"SpecSrch_GenInfoLnk_Slctd")},n=function(a){if(a&&a.IsOpen()){a.mOpen=!1;x(a.LinkElem());var b=SpecInteractions.GetComplementaryElemById(a.LinkElem().id);b&&x(b);SpecSrchWebPart.SpecInfo.mOpenInfos[a.Id()]&&delete SpecSrchWebPart.SpecInfo.mOpenInfos[a.Id()];a=Cmn.GetObj(SpecSrchWebPart.SpecInfo.Constants.OUTER_PREFIX+a.Id());Cmn.RemElem(a.parentNode)}},
g=function(a,b){if(a&&a!==document)for(;a&&a!==document.body;){if(Cmn.HasCls(a,b))return a;a=a.parentNode}return null},s=function(a,b){if(a&&a!==document)for(;a&&a!==document.body;){if(a.id===b)return a;a=a.parentNode}return null},B=function(a,b){var d=SpecSrchInp.Get(),c=a.ProdAttrIds();if(1!=c.length&&1<c.length){var e=a.TopLvlAttrId(),f=a.TopLvlProdAttrId();d.UsrInps().LastExplicitlyExpandedAttr===e||Cmn.Utilities.Empty(d.GetAttrSlctdVals(f,b))||(c=c.slice(1))}d.RemAttrs(c,b);return d},C=function(a){a=
v();var b=Cmn.GetObj("ProdPageContent"),b=Cmn.GetWidth(b);return Math.min(Math.max(b/2,400),a)},v=function(){var a=Cmn.GetObj("ProdPageContent");return Cmn.GetWidth(a)-60}}})();


(function(){window.mPageEmbeddedFiles=window.mPageEmbeddedFiles||{};var f=window.mPageEmbeddedFiles;f['inlnordwebpart.js']=1;f['inlnordwebpartdynamicrendering.js']=1;f['itmbookmark.js']=1;f['specinteractions.js']=1;f['specsrchwebpart.js']=1;f['specsrchwebpart.specinfo.js']=1;})();