(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.mp4Reader = factory());
}(this, function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var Stream =
  /*#__PURE__*/
  function () {
    function Stream(buffer) {
      _classCallCheck(this, Stream);

      this.buffer = buffer;
      this.position = 0;
    }

    _createClass(Stream, [{
      key: "readType",
      value: function readType() {
        var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
        var typeBuffer = [];

        for (var i = 0; i < length; i++) {
          typeBuffer.push(this.buffer[this.position++]);
        }

        return String.fromCharCode.apply(null, typeBuffer);
      }
    }, {
      key: "readByte",
      value: function readByte(length) {
        switch (length) {
          case 1:
            return this.readOneByte();

          case 2:
            return this.readTwoByte();

          case 3:
            return this.readThreeByte();

          case 4:
            return this.readFourByte();

          default:
            return 0;
        }
      }
    }, {
      key: "readOneByte",
      value: function readOneByte() {
        return this.buffer[this.position++] >>> 0;
      }
    }, {
      key: "readTwoByte",
      value: function readTwoByte() {
        return (this.buffer[this.position++] << 8 | this.buffer[this.position++]) >>> 0;
      }
    }, {
      key: "readThreeByte",
      value: function readThreeByte() {
        return (this.buffer[this.position++] << 16 | this.buffer[this.position++] << 8 | this.buffer[this.position++]) >>> 0;
      }
    }, {
      key: "readFourByte",
      value: function readFourByte() {
        return (this.buffer[this.position++] << 24 | this.buffer[this.position++] << 16 | this.buffer[this.position++] << 8 | this.buffer[this.position++]) >>> 0;
      }
    }]);

    return Stream;
  }();

  function ftyp(buffer) {
    var stream = new Stream(buffer);
    var majorBrand = stream.readType();
    var minorVersion = stream.readByte(4);
    var compatibleBrands = [];

    for (var i = stream.position; i < buffer.length; i += 4) {
      compatibleBrands.push(stream.readType(4));
    }

    var ftypBox = {
      majorBrand: majorBrand,
      minorVersion: minorVersion,
      compatibleBrands: compatibleBrands
    };
    return ftypBox;
  }

  function mvhd(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3);
    var creationTime = stream.readByte(4);
    var modificationTime = stream.readByte(4);
    var timescale = stream.readByte(4);
    var duration = stream.readByte(4);
    var rate = stream.readByte(4);
    var volume = stream.readByte(1); // reserved

    stream.readByte(3);
    stream.readByte(4);
    stream.readByte(4);
    var matrix = [];

    for (var i = 0; i < 36; i += 4) {
      matrix.push(stream.readByte(4));
    } // preDefined


    for (var _i = 0; _i < 24; _i += 4) {
      stream.readByte(4);
    }

    var nextTrackID = stream.readByte(4);
    var mvhdBox = {
      version: version,
      flags: flags,
      creationTime: creationTime,
      modificationTime: modificationTime,
      timescale: timescale,
      duration: duration,
      rate: rate,
      volume: volume,
      matrix: matrix,
      nextTrackID: nextTrackID
    };
    return mvhdBox;
  }

  function tkhd(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3);
    var creationTime = stream.readByte(4);
    var modificationTime = stream.readByte(4);
    var trackID = stream.readByte(4); // reserved

    stream.readByte(4);
    var duration = stream.readByte(4); // reserved

    stream.readByte(4);
    stream.readByte(4);
    var layer = stream.readByte(2);
    var alternateGroup = stream.readByte(2);
    var volume = stream.readByte(2); // reserved

    stream.readByte(2);
    var matrix = [];

    for (var i = 0; i < 36; i += 4) {
      matrix.push(stream.readByte(4));
    }

    var width = Number("".concat(stream.readByte(2), ".").concat(stream.readByte(2)));
    var height = Number("".concat(stream.readByte(2), ".").concat(stream.readByte(2)));
    var tkhdBox = {
      version: version,
      flags: flags,
      creationTime: creationTime,
      modificationTime: modificationTime,
      trackID: trackID,
      duration: duration,
      layer: layer,
      alternateGroup: alternateGroup,
      volume: volume,
      matrix: matrix,
      width: width,
      height: height
    };
    return tkhdBox;
  }

  function elst(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3);
    var entryCount = stream.readByte(4);
    var entries = [];

    for (var i = 0; i < entryCount; ++i) {
      var segmentDuration = stream.readByte(4);
      var mediaTime = stream.readByte(4); // 0xffffffff -> -1

      if (mediaTime === 4294967295) {
        mediaTime = -1;
      }

      var mediaRateInteger = stream.readByte(2);
      var mediaRateFraction = stream.readByte(2);
      entries.push({
        segmentDuration: segmentDuration,
        mediaTime: mediaTime,
        mediaRateInteger: mediaRateInteger,
        mediaRateFraction: mediaRateFraction
      });
    }

    var elstBox = {
      version: version,
      flags: flags,
      entries: entries
    };
    return elstBox;
  }

  function mdhd(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3);
    var creationTime = stream.readByte(4);
    var modificationTime = stream.readByte(4);
    var timescale = stream.readByte(4);
    var duration = stream.readByte(4);
    var language = stream.readByte(2);
    var field = [];
    field[0] = language >> 10 & 0x1f;
    field[1] = language >> 5 & 0x1f;
    field[2] = language & 0x1f;
    var languageString = String.fromCharCode(0x60 + field[0], 0x60 + field[1], 0x60 + field[2]); // preDefined

    stream.readByte(2);
    var mdhdBox = {
      version: version,
      flags: flags,
      creationTime: creationTime,
      modificationTime: modificationTime,
      timescale: timescale,
      duration: duration,
      languageString: languageString
    };
    return mdhdBox;
  }

  function hdlr(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3); // preDefined

    stream.readByte(4);
    var handlerType = stream.readType().toString();
    var handlerType2 = stream.readType().toString(); // reserved

    stream.readByte(4);
    stream.readByte(4);
    var name = [];
    var c;

    while ((c = stream.readByte(1)) !== 0x00) {
      name.push(String.fromCharCode(c));
    }

    var hdlrBox = {
      version: version,
      flags: flags,
      handlerType: handlerType,
      handlerType2: handlerType2 || 0,
      name: name.join('')
    };
    return hdlrBox;
  }

  function vmhd(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3);
    var graphicsmode = stream.readByte(2);
    var opcolor = new Array(3).fill(stream.readByte(2));
    var vmhdBox = {
      version: version,
      flags: flags,
      graphicsmode: graphicsmode,
      opcolor: opcolor
    };
    return vmhdBox;
  }

  function dref(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3);
    var entryCount = stream.readByte(4);
    var urlBox = [];
    var urlBuffer = stream.buffer.slice(8);
    var newStream = new Stream(urlBuffer);
    var MP4Box$1 = new MP4Box();

    for (var i = 0; i < entryCount; i++) {
      MP4Box$1.readSize(newStream);
      MP4Box$1.readType(newStream);
      MP4Box$1.readBody(newStream);
      urlBox.push(MP4Box$1.box);
    }

    var drefBox = {
      version: version,
      flags: flags,
      url: urlBox
    };
    return drefBox;
  }

  function url(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3);
    var urlBox = {
      version: version,
      flags: flags
    };
    return urlBox;
  }

  function stsd(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3);
    var entryCount = stream.readByte(4);
    var box = [];
    var avc1Buffer = stream.buffer.slice(8);
    var newStream = new Stream(avc1Buffer);
    var MP4Box$1 = new MP4Box();
    var type = 'avc1';

    for (var i = 0; i < entryCount; i++) {
      MP4Box$1.readSize(newStream);
      MP4Box$1.readType(newStream);
      MP4Box$1.readBody(newStream);
      box.push(MP4Box$1.box);
      type = MP4Box$1.type;
    }

    var stsdBox = _defineProperty({
      version: version,
      flags: flags
    }, type, box);

    return stsdBox;
  }

  function avc1(buffer) {
    var stream = new Stream(buffer); // reserved

    stream.readByte(4);
    stream.readByte(2);
    var dataReferenceIndex = stream.readByte(2); // preDefined

    stream.readByte(2); // reserved

    stream.readByte(2); // preDefined

    stream.readByte(4);
    stream.readByte(4);
    stream.readByte(4);
    var width = stream.readByte(2);
    var height = stream.readByte(2);
    var horizresolution = stream.readByte(4);
    var vertresolution = stream.readByte(4); // reserved

    stream.readByte(4);
    var frameCount = stream.readByte(2);
    var compressorname = stream.readType(32);
    var depth = stream.readByte(2); // preDefined

    stream.readByte(2);
    var avcCBuffer = stream.buffer.slice(78);
    var newStream = new Stream(avcCBuffer);
    var MP4Box$1 = new MP4Box();
    MP4Box$1.readSize(newStream);
    MP4Box$1.readType(newStream);
    MP4Box$1.readBody(newStream);
    var avcCBox = MP4Box$1.box;
    var avc1Box = {
      dataReferenceIndex: dataReferenceIndex,
      width: width,
      height: height,
      horizresolution: horizresolution,
      vertresolution: vertresolution,
      frameCount: frameCount,
      compressorname: compressorname,
      depth: depth,
      avcC: avcCBox
    };
    return avc1Box;
  }

  function avcC(buffer) {
    var stream = new Stream(buffer);
    var configurationVersion = stream.readByte(1);
    var AVCProfileIndication = stream.readByte(1);
    var profileCompatibility = stream.readByte(1);
    var AVCLevelIndication = stream.readByte(1);
    var lengthSizeMinusOne = stream.readByte(1) & 0x3;
    var numOfSequenceParameterSets = stream.readByte(1) & 31;
    var SPS = [];

    for (var i = 0; i < numOfSequenceParameterSets; i++) {
      var length = stream.readByte(2);
      SPS.push.apply(SPS, _toConsumableArray(stream.buffer.slice(stream.position, stream.position + length)));
      stream.position += length;
    }

    var numOfPictureParameterSets = stream.readByte(1);
    var PPS = [];

    for (var _i = 0; _i < numOfPictureParameterSets; _i++) {
      var _length = stream.readByte(2);

      PPS.push.apply(PPS, _toConsumableArray(stream.buffer.slice(stream.position, stream.position + _length)));
      stream.position += _length;
    }

    var avcCBox = {
      configurationVersion: configurationVersion,
      AVCProfileIndication: AVCProfileIndication,
      profileCompatibility: profileCompatibility,
      AVCLevelIndication: AVCLevelIndication,
      lengthSizeMinusOne: lengthSizeMinusOne,
      SPS: SPS,
      PPS: PPS
    };
    return avcCBox;
  }

  function stts(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3);
    var entryCount = stream.readByte(4);
    var samples = [];

    for (var i = 0; i < entryCount; i++) {
      var sampleCount = stream.readByte(4);
      var sampleDelta = stream.readByte(4);
      samples.push({
        sampleCount: sampleCount,
        sampleDelta: sampleDelta
      });
    }

    var sttsBox = {
      version: version,
      flags: flags,
      samples: samples
    };
    return sttsBox;
  }

  function stss(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3);
    var entryCount = stream.readByte(4);
    var samples = [];

    for (var i = 0; i < entryCount; i++) {
      samples.push({
        sampleNumber: stream.readByte(4)
      });
    }

    var stssBox = {
      version: version,
      flags: flags,
      samples: samples
    };
    return stssBox;
  }

  function ctts(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3);
    var entryCount = stream.readByte(4);
    var samples = [];

    for (var i = 0; i < entryCount; i++) {
      samples.push({
        sampleCount: stream.readByte(4),
        sampleOffset: stream.readByte(4)
      });
    }

    var cttsBox = {
      version: version,
      flags: flags,
      samples: samples
    };
    return cttsBox;
  }

  function mdhd$1(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3);
    var entryCount = stream.readByte(4);
    var samples = [];

    for (var i = 0; i < entryCount; i++) {
      samples.push({
        firstChunk: stream.readByte(4),
        samplesPerChunk: stream.readByte(4),
        sampleDescriptionIndex: stream.readByte(4)
      });
    }

    var mdhdBox = {
      version: version,
      flags: flags,
      samples: samples
    };
    return mdhdBox;
  }

  function stss$1(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3);
    var sampleSize = stream.readByte(4);
    var sampleCount = stream.readByte(4);
    var samples = [];

    for (var i = 0; i < sampleCount; i++) {
      samples.push({
        entrySize: stream.readByte(4)
      });
    }

    var stssBox = {
      version: version,
      flags: flags,
      sampleSize: sampleSize,
      samples: samples
    };
    return stssBox;
  }

  function stco(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3);
    var entryCount = stream.readByte(4);
    var samples = [];

    for (var i = 0; i < entryCount; i++) {
      samples.push({
        chunkOffset: stream.readByte(4)
      });
    }

    var stcoBox = {
      version: version,
      flags: flags,
      samples: samples
    };
    return stcoBox;
  }

  function smhd(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3);
    var data = [];

    for (var i = 0; i < 4; i++) {
      data.push(stream.readByte(1));
    }

    var smhdBox = {
      version: version,
      flags: flags,
      data: data
    };
    return smhdBox;
  }

  function mp4a(buffer) {
    var stream = new Stream(buffer); // reserved

    stream.readByte(4);
    stream.readByte(2);
    var dataReferenceIndex = stream.readByte(2); // preDefined

    stream.readByte(2); // reserved

    stream.readByte(2); // preDefined

    stream.readByte(4);
    var channelCount = stream.readByte(2);
    var sampleSize = stream.readByte(2); // reserved

    stream.readByte(4);
    var sampleRate = stream.readByte(4) / (1 << 16);
    var esdsBuffer = stream.buffer.slice(28);
    var newStream = new Stream(esdsBuffer);
    var MP4Box$1 = new MP4Box();
    MP4Box$1.readSize(newStream);
    MP4Box$1.readType(newStream);
    MP4Box$1.readBody(newStream);
    var esdsBox = MP4Box$1.box;
    var mp4aBox = {
      dataReferenceIndex: dataReferenceIndex,
      channelCount: channelCount,
      sampleSize: sampleSize,
      sampleRate: sampleRate,
      esds: esdsBox
    };
    return mp4aBox;
  }

  var TAGS = [null, null, null, 'ESDescrTag', 'DecoderConfigDescrTag', 'DecSpecificDescrTag'];
  function esds(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3);
    var type = TAGS[stream.readByte(1)];

    var esdsBox = _defineProperty({
      version: version,
      flags: flags
    }, type, getESDescrTag(stream));

    return esdsBox;
  }

  function getESDescrTag(stream) {
    var data = {};
    var size = stream.readByte(1);

    if (size === 0x80) {
      stream.readByte(2);
      size = stream.readByte(1) + 5;
    } else {
      size += 2;
    }

    data.size = size;
    data.ESID = stream.readByte(2);
    data.streamPriority = stream.readByte(1);
    data[TAGS[stream.readByte(1)]] = getDecoderConfigDescrTag(stream);
    data[TAGS[stream.readByte(1)]] = getDecSpecificDescrTag(stream);
    return data;
  }

  function getDecoderConfigDescrTag(stream) {
    var data = {};
    var size = stream.readByte(1);

    if (size === 0x80) {
      stream.readByte(2);
      size = stream.readByte(1) + 5;
    } else {
      size += 2;
    }

    data.size = size;
    data.objectTypeIndication = stream.readByte(1);
    var type = stream.readByte(1);
    data.streamType = type & (1 << 7) - 1;
    data.upStream = type & 1 << 1;
    data.bufferSize = stream.readByte(3);
    data.maxBitrate = stream.readByte(4);
    data.avgBitrate = stream.readByte(4);
    return data;
  }

  function getDecSpecificDescrTag(stream) {
    var data = {};
    var size = stream.readByte(1);
    var dataSize = size;

    if (size === 0x80) {
      stream.readByte(2);
      size = stream.readByte(1) + 5;
      dataSize = size - 5;
    } else {
      size += 2;
    }

    data.size = size;
    var EScode = [];

    for (var i = 0; i < dataSize; i++) {
      EScode.push(Number(stream.readByte(1)).toString(16).padStart(2, '0'));
    }

    data.audioConfig = EScode.map(function (item) {
      return Number("0x".concat(item));
    });
    return data;
  }

  function meta(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3);
    var metaBox = {
      version: version,
      flags: flags
    };
    return metaBox;
  }

  function mdat(buffer) {
    var stream = new Stream(buffer);
    var data = stream.buffer.subarray(stream.position, stream.buffer.length);
    var mdatBox = {
      data: data
    };
    return mdatBox;
  }

  function sdtp(buffer) {
    var stream = new Stream(buffer);
    var version = stream.readByte(1);
    var flags = stream.readByte(3);
    var samplesFlag = [];

    for (var i = stream.position; i < buffer.length; i++) {
      var tmpByte = stream.readByte(1);
      samplesFlag.push({
        isLeading: tmpByte >> 6,
        dependsOn: tmpByte >> 4 & 0x3,
        isDepended: tmpByte >> 2 & 0x3,
        hasRedundancy: tmpByte & 0x3
      });
    }

    var sdtpBox = {
      version: version,
      flags: flags,
      samplesFlag: samplesFlag
    };
    return sdtpBox;
  }

  function thmb(buffer) {
    var stream = new Stream(buffer);
    var data = stream.readByte(buffer.length);
    var thmbBox = {
      data: data
    };
    return thmbBox;
  }

  var boxParse = {
    ftyp: ftyp,
    mvhd: mvhd,
    tkhd: tkhd,
    elst: elst,
    mdhd: mdhd,
    hdlr: hdlr,
    vmhd: vmhd,
    dref: dref,
    'url ': url,
    stsd: stsd,
    avc1: avc1,
    avcC: avcC,
    stts: stts,
    stss: stss,
    ctts: ctts,
    stsc: mdhd$1,
    stsz: stss$1,
    stco: stco,
    smhd: smhd,
    mp4a: mp4a,
    esds: esds,
    meta: meta,
    mdat: mdat,
    sdtp: sdtp,
    thmb: thmb
  };

  var CONTAINER_BOXES = ['moov', 'trak', 'edts', 'mdia', 'minf', 'dinf', 'stbl'];
  var SPECIAL_BOXES = ['udta', 'free'];

  var MP4Box =
  /*#__PURE__*/
  function () {
    function MP4Box() {
      _classCallCheck(this, MP4Box);

      this.size = 0;
      this.type = '';
      this.start = 0;
      this.box = {};
    }

    _createClass(MP4Box, [{
      key: "readSize",
      value: function readSize(stream) {
        this.start = stream.position;
        this.size = stream.readByte(4);
      }
    }, {
      key: "readType",
      value: function readType(stream) {
        this.type = stream.readType(); // 一个 box 的 size 只可能大于等于 8
        // 如果从 readSize 中解析出来的 mdat size 为 1，则表明此视频比较大，需要 type 后的 8 个字节来计算实际大小

        if (this.size === 1) {
          this.size = stream.readByte(4) << 32;
          this.size |= stream.readByte(4);
        }
      }
    }, {
      key: "readBody",
      value: function readBody(stream) {
        var _this = this;

        this.data = stream.buffer.slice(stream.position, this.size + this.start);

        if (CONTAINER_BOXES.find(function (item) {
          return item === _this.type;
        }) || SPECIAL_BOXES.find(function (item) {
          return item === _this.type;
        })) {
          this.parserContainerBox();
        } else {
          if (!boxParse[this.type]) {
            this.box = {};
          } else {
            this.box = _objectSpread2({}, this.box, {}, boxParse[this.type](this.data));
          }
        }

        stream.position += this.data.length;
      }
    }, {
      key: "parserContainerBox",
      value: function parserContainerBox() {
        var stream = new Stream(this.data);
        var size = stream.buffer.length;

        while (stream.position < size) {
          var Box = new MP4Box();
          Box.readSize(stream);
          Box.readType(stream);
          Box.readBody(stream);
          Box.box.size = Box.size;
          Box.box.type = Box.type;

          if (Box.type === 'trak') {
            var handlerType = Box.box.mdia.hdlr.handlerType;

            if (handlerType === 'vide') {
              this.box.videoTrak = Box.box;
            } else if (handlerType === 'soun') {
              this.box.audioTrak = Box.box;
            } else {
              this.box["".concat(handlerType, "Trak")] = Box.box;
            }
          } else {
            this.box[Box.type] = Box.box;
          }
        }
      }
    }]);

    return MP4Box;
  }();

  var MP4Parse =
  /*#__PURE__*/
  function () {
    function MP4Parse(buffer) {
      _classCallCheck(this, MP4Parse);

      this.buffer = buffer;
      this.stream = new Stream(buffer);
      this.mp4BoxTreeArray = [];
      this.mp4BoxTreeObject = {};
      this.init();
    }

    _createClass(MP4Parse, [{
      key: "init",
      value: function init() {
        this.parse();
      }
    }, {
      key: "parse",
      value: function parse() {
        while (this.stream.position < this.buffer.length) {
          var MP4Box$1 = new MP4Box();
          MP4Box$1.readSize(this.stream);
          MP4Box$1.readType(this.stream);
          MP4Box$1.readBody(this.stream);
          MP4Box$1.box.size = MP4Box$1.size;
          MP4Box$1.box.type = MP4Box$1.type;
          this.mp4BoxTreeArray.push(MP4Box$1.box);
          this.mp4BoxTreeObject[MP4Box$1.type] = MP4Box$1.box;
          this.mp4BoxTreeObject[MP4Box$1.type].size = MP4Box$1.size;
        }
      }
    }]);

    return MP4Parse;
  }();

  function myFetch(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.responseType = 'arraybuffer'; // xhr.setRequestHeader('Range', `bytes=0-2524488`)

    xhr.onload = function () {
      cb(xhr.response);
    };

    xhr.send();
  }

  var ownTmpl = function ownTmpl(type, index) {
    return "<div class=\"own\" style=\"width:".concat(index * 60, "px;\">\n                <div class=\"triangle triangle-right\"></div>\n                <div class=\"type-name\">").concat(type, "</div>\n            </div>");
  };

  var createBox = function createBox(type, index) {
    var box = document.createElement('div');
    box.setAttribute('class', 'box hide-children');
    box.innerHTML = ownTmpl(type, index);
    return box;
  };

  var resolveObj = function resolveObj(boxObj) {
    var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var type = boxObj.type;
    var box = createBox(type, index);
    ++index;
    var hasChild = false;
    var props = {};

    for (var key in boxObj) {
      if (Object.prototype.toString.call(boxObj[key]) == "[object Object]") {
        hasChild = true;
        var cbox = resolveObj(boxObj[key], index);
        box.appendChild(cbox);
      } else if (Object.prototype.toString.call(boxObj[key]) == "[object Array]") {
        var temp = '';
        boxObj[key].forEach(function (val) {
          if (_typeof(val) == 'object') {
            temp += JSON.stringify(val);
          } else {
            temp += val;
          }
        });
        props[key] = temp;
      } else {
        if (type == 'mdat' && key == 'data') {
          continue;
        }

        props[key] = boxObj[key].toString();
      }
    }

    if (!hasChild) {
      box.setAttribute('class', 'box');

      var _own = box.querySelector('.own');

      var triangle = box.querySelector('.triangle');

      _own.removeChild(triangle);
    }

    var own = box.querySelector('.own');
    own.setAttribute('data', JSON.stringify(props));
    return box;
  };

  var bindEvent = function bindEvent() {
    var triangleList = document.querySelectorAll('.triangle');
    Array.prototype.forEach.call(triangleList, function (val) {
      val.addEventListener('click', function (e) {
        var triangleClass = e.currentTarget.getAttribute('class');

        if (triangleClass.search('triangle-right') > -1) {
          e.currentTarget.setAttribute('class', 'triangle triangle-down');
        } else {
          e.currentTarget.setAttribute('class', 'triangle triangle-right');
        }

        var parentOwn = e.currentTarget.parentNode;
        var parentBox = parentOwn.parentNode;
        var classStr = parentBox.getAttribute("class");

        if (classStr.search('hide-children') > -1) {
          parentBox.setAttribute("class", 'box');
        } else {
          parentBox.setAttribute("class", 'box hide-children');
        }
      });
    });
    var ownList = document.querySelectorAll('.own');
    Array.prototype.forEach.call(ownList, function (val) {
      val.addEventListener('click', function (e) {
        var data = JSON.parse(e.currentTarget.getAttribute('data'));
        var fragment = document.createDocumentFragment();

        for (var key in data) {
          var d = document.createElement('div');
          d.innerText = "".concat(key, " : ").concat(data[key]);
          fragment.appendChild(d);
        }

        document.getElementById('content').innerHTML = '';
        document.getElementById('content').appendChild(fragment);
      });
    });
  };

  var init = function init(arrayBuffer) {
    var buffer = new Uint8Array(arrayBuffer);
    var mp4Parser = new MP4Parse(buffer);
    var mp4BoxTreeArray = mp4Parser.mp4BoxTreeArray;
    var arrayLength = mp4BoxTreeArray.length;
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < arrayLength; i++) {
      var boxObj = mp4BoxTreeArray[i];
      var box = resolveObj(boxObj);
      fragment.appendChild(box);
    }

    document.getElementById('root').innerHTML = '';
    document.getElementById('root').appendChild(fragment);
    bindEvent();
  };

  function parseObj () {
    document.getElementById('reader-btn').addEventListener('click', function () {
      var source = document.getElementById('source').files[0];
      var sourceUrl = document.getElementById('sourceUrl').value;

      if (source) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(source);

        reader.onload = function () {
          init(this.result);
        };
      } else if (sourceUrl) {
        myFetch(sourceUrl, function (buf) {
          init(buf);
        });
      } else {
        alert("啥也没有，分析啥啊！");
      }
    });
  }

  return parseObj;

}));
